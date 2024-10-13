import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user';
import { PrismaService } from '../prisma';
import { testAWS, testAccessToken, testUser } from '../../constants';
import { RoleService } from '../role';
import { CognitoService } from '../cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

// TODO: Fix and add more tests
describe.skip('AuthService', () => {
  let service: AuthService;
  let cognitoClient: jest.Mocked<CognitoIdentityProviderClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        RoleService,
        PrismaService,
        CognitoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return testAWS.region;
              if (key === 'COGNITO_USER_POOL_CLIENT_ID')
                return testAWS.clientId;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    cognitoClient = service[
      'cognitoClient'
    ] as jest.Mocked<CognitoIdentityProviderClient>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      cognitoClient.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.signIn(testUser.email, testUser.password);
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(InitiateAuthCommand),
      );
    });

    it('should throw UnauthorizedException on sign in failure', async () => {
      cognitoClient.send = jest
        .fn()
        .mockRejectedValue(new Error('Auth failed'));

      await expect(
        service.signIn(testUser.email, testUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('setNewPassword', () => {
    it('should successfully set new password', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      cognitoClient.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.setNewPassword(
        testUser.email,
        'newPass',
        'session',
      );
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(RespondToAuthChallengeCommand),
      );
    });

    it('should throw UnauthorizedException on set new password failure', async () => {
      cognitoClient.send = jest
        .fn()
        .mockRejectedValue(new Error('Failed to set password'));

      await expect(
        service.setNewPassword(testUser.email, 'newPass', 'session'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      cognitoClient.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.changePassword(
        testAccessToken,
        'oldPass',
        'newPass',
      );
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(ChangePasswordCommand),
      );
    });

    it('should throw UnauthorizedException on change password failure', async () => {
      cognitoClient.send = jest
        .fn()
        .mockRejectedValue(new Error('Failed to change password'));

      await expect(
        service.changePassword(testAccessToken, 'oldPass', 'newPass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should successfully initiate password reset', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      cognitoClient.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.forgotPassword(testUser.email);
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(ForgotPasswordCommand),
      );
    });

    it('should throw UnauthorizedException on forgot password failure', async () => {
      cognitoClient.send = jest
        .fn()
        .mockRejectedValue(new Error('Failed to initiate password reset'));

      await expect(service.forgotPassword(testUser.email)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('confirmResetPassword', () => {
    it('should successfully confirm password reset', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      cognitoClient.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await service.confirmResetPassword(
        testUser.email,
        'resetCode',
        'newPass',
      );
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(ConfirmForgotPasswordCommand),
      );
    });

    it('should throw UnauthorizedException on confirm reset password failure', async () => {
      cognitoClient.send = jest
        .fn()
        .mockRejectedValue(new Error('Failed to confirm password reset'));

      await expect(
        service.confirmResetPassword(testUser.email, 'resetCode', 'newPass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('logout', () => {
    it('should call GlobalSignOutCommand with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };

      (cognitoClient.send as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.logout(testAccessToken);
      expect(result).toEqual(mockResponse);
      expect(cognitoClient.send).toHaveBeenCalledWith(
        expect.any(GlobalSignOutCommand),
      );
    });

    it('should throw UnauthorizedException on logout failure', async () => {
      (cognitoClient.send as jest.Mock).mockRejectedValue(
        new Error('Failed to log out'),
      );

      await expect(service.logout(testAccessToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
