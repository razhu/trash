import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ChangePasswordCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommandOutput,
  ChangePasswordCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  GlobalSignOutCommand,
  GlobalSignOutCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import {
  SignInResponseDto,
  SignUpResponseDto,
  SignUpVerifyResponseDto,
  ForgotPasswordResponseDto,
} from './dto';
import { UserService } from '../user';
import { User as UserType } from '@prisma/client';
import { UserRole } from '../../enums';
import { RoleService } from '../role';
import { CognitoService } from '../cognito';

@Injectable()
export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;
  private clientId: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cognitoService: CognitoService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.clientId = this.configService.get<string>(
      'COGNITO_USER_POOL_CLIENT_ID',
    );
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    termsAccepted: boolean,
    userRole: UserRole,
  ): Promise<SignUpResponseDto> {
    if (!termsAccepted) {
      throw new Error('Terms and conditions must be accepted');
    }

    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'custom:roleType', Value: userRole },
      ],
    });

    try {
      const signUpResponse = await this.cognitoService.sendCommand<
        SignUpCommand,
        SignUpCommandOutput
      >(command, 'Sign up failed');

      const cognitoSub = signUpResponse?.UserSub;
      return { cognitoSub };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Sign up failed');
    }
  }

  async verifySignUp(
    email: string,
    password: string,
    code: string,
    timezone: string,
  ): Promise<SignUpVerifyResponseDto> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    });

    try {
      await this.cognitoService.sendCommand<
        ConfirmSignUpCommand,
        ConfirmSignUpCommandOutput
      >(command, 'Code confirmation failed');

      const authCommand = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const authResponse = await this.cognitoService.sendCommand<
        InitiateAuthCommand,
        InitiateAuthCommandOutput
      >(authCommand, 'Sign in failed');

      const accessToken = authResponse?.AuthenticationResult?.AccessToken;

      const userAttributes =
        await this.userService.getCognitoUserAttributes(accessToken);

      const user = await this.userService.createUser({
        email,
        first_name: userAttributes.firstName,
        last_name: userAttributes.lastName,
        cognito_sub: userAttributes.cognitoSub,
        timezone,
        last_login: new Date(),
      } as UserType);

      await this.roleService.assignUserRole(user.id, userAttributes.userRole);

      return { user, token: authResponse.AuthenticationResult };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Code confirmation failed');
    }
  }

  async signIn(email: string, password: string): Promise<SignInResponseDto> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const authResponse = await this.cognitoService.sendCommand<
      InitiateAuthCommand,
      InitiateAuthCommandOutput
    >(command, 'Sign in failed');

    const user = await this.userService.updateLastLoginByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found in DB`);
    }

    return {
      user, //TODO:return permissions to based on role
      token: authResponse.AuthenticationResult,
      challengeName: authResponse.ChallengeName,
      session: authResponse.Session,
    };
  }

  async setNewPassword(email: string, password: string, session: string) {
    const command = new RespondToAuthChallengeCommand({
      ClientId: this.clientId,
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: password,
      },
      Session: session,
    });

    return this.cognitoService.sendCommand<
      RespondToAuthChallengeCommand,
      RespondToAuthChallengeCommandOutput
    >(command, 'Failed to set new password');
  }

  async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string,
  ) {
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
    });

    return this.cognitoService.sendCommand<
      ChangePasswordCommand,
      ChangePasswordCommandOutput
    >(command, 'Failed to change password');
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
    });

    const response = await this.cognitoService.sendCommand<
      ForgotPasswordCommand,
      ForgotPasswordCommandOutput
    >(command, 'Failed to initiate password reset');

    const {
      email: userEmail,
      first_name,
      last_name,
      profile_image_url,
    } = await this.userService.getUserByEmail(email);

    return {
      user: {
        email: userEmail,
        first_name,
        last_name,
        profile_image_url,
      } as UserType,
      codeDeliveryDetails: response.CodeDeliveryDetails,
    };
  }

  async confirmResetPassword(
    email: string,
    confirmationCode: string,
    newPassword: string,
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    });
    return this.cognitoService.sendCommand<
      ConfirmForgotPasswordCommand,
      ConfirmForgotPasswordCommandOutput
    >(command, 'Failed to confirm password reset');
  }

  async logout(accessToken: string) {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    return this.cognitoService.sendCommand<
      GlobalSignOutCommand,
      GlobalSignOutCommandOutput
    >(command, 'Failed to log out');
  }
}
