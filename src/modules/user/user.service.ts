import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountStatusResponseDto, VerifyEmailResponseDto } from './dto';
import { PrismaService } from '../prisma';
import { User as UserType } from '@prisma/client';
import {
  GetUserCommand,
  GetUserCommandOutput,
  UpdateUserAttributesCommand,
  UpdateUserAttributesCommandOutput,
  VerifyUserAttributeCommand,
  VerifyUserAttributeCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { extractCognitoUserAttributes } from '../../utils';
import { CognitoService } from '../cognito';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(userData: UserType): Promise<UserType> {
    return this.prisma.user.create({
      data: {
        ...userData,
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserType> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getCognitoUserAttributes(accessToken: string) {
    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken,
    });

    const getUserResponse = await this.cognitoService.sendCommand<
      GetUserCommand,
      GetUserCommandOutput
    >(getUserCommand, 'Failed to retrieve user attributes');

    const userAttributes = extractCognitoUserAttributes(
      getUserResponse?.UserAttributes,
    );

    return userAttributes;
  }

  async verifyEmail(email: string): Promise<VerifyEmailResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return { emailExistsInDB: user !== null };
  }

  async getUserAccountStatus(
    userId: string,
  ): Promise<AccountStatusResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userVehicles: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPhoneVerified = user.phone_number !== null;
    const isVehicleSelected = user.userVehicles.length > 0;
    const isPaymentAdded = false; // TODO: Calculate payment logic once payment has been integrated
    const isSetupComplete = user.is_setup_complete;
    const isActive = user.is_active;

    return {
      isPhoneVerified,
      isVehicleSelected,
      isPaymentAdded,
      isSetupComplete,
      isActive,
    };
  }

  async activateUserAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is_active: true, is_setup_complete: true },
    });
  }

  async updateLastLoginByEmail(email: string): Promise<UserType> {
    return this.prisma.user.update({
      where: { email },
      data: { last_login: new Date() },
    });
  }

  async saveUserVehicle(userId: string, vehicleId: number): Promise<void> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    await this.prisma.userVehicle.create({
      data: {
        user_id: userId,
        vehicle_id: vehicleId,
      },
    });
  }

  async sendPhoneCode(accessToken: string, phoneNumber: string): Promise<void> {
    const command = new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
      ],
    });

    try {
      await this.cognitoService.sendCommand<
        UpdateUserAttributesCommand,
        UpdateUserAttributesCommandOutput
      >(command, 'Phone confirmation failed');
    } catch (error) {
      this.logger.error(error);
      throw new Error('Unable to send verification code');
    }
  }

  async verifyPhoneCode(
    accessToken: string,
    code: string,
    userId: string,
  ): Promise<void> {
    const verifyCommand = new VerifyUserAttributeCommand({
      AccessToken: accessToken,
      Code: code,
      AttributeName: 'phone_number',
    });

    try {
      await this.cognitoService.sendCommand<
        VerifyUserAttributeCommand,
        VerifyUserAttributeCommandOutput
      >(verifyCommand, 'Failed to verify phone number');

      const getUserCommand = new GetUserCommand({
        AccessToken: accessToken,
      });

      const user = await this.cognitoService.sendCommand<
        GetUserCommand,
        GetUserCommandOutput
      >(getUserCommand, 'Failed to get user');

      const phoneNumberAttribute = user.UserAttributes?.find(
        (attr) => attr.Name === 'phone_number',
      );
      const phoneNumber = phoneNumberAttribute
        ? phoneNumberAttribute.Value
        : null;

      if (phoneNumber) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            phone_number: phoneNumber,
          },
        });
      } else {
        throw new Error('Phone number not found');
      }
    } catch (error) {
      this.logger.error(error);
      throw new Error('Verification code is invalid or expired');
    }
  }
}
