import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GlobalSignOutCommand,
  SignUpCommand,
  GetUserCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommandOutput,
  ChangePasswordCommandOutput,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  GlobalSignOutCommandOutput,
  SignUpCommandOutput,
  GetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoService {
  protected cognitoClient: CognitoIdentityProviderClient;
  private readonly logger = new Logger(CognitoService.name);

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async sendCommand<
    T extends
      | InitiateAuthCommand
      | RespondToAuthChallengeCommand
      | ChangePasswordCommand
      | ForgotPasswordCommand
      | ConfirmForgotPasswordCommand
      | GlobalSignOutCommand
      | SignUpCommand
      | GetUserCommand,
    O extends
      | InitiateAuthCommandOutput
      | RespondToAuthChallengeCommandOutput
      | ChangePasswordCommandOutput
      | ForgotPasswordCommandOutput
      | ConfirmForgotPasswordCommandOutput
      | GlobalSignOutCommandOutput
      | SignUpCommandOutput
      | GetUserCommandOutput,
  >(command: T, errorMessage: string): Promise<O> {
    try {
      return (await this.cognitoClient.send(
        command as InitiateAuthCommand,
      )) as O;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(errorMessage);
    }
  }
}
