import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { testAccessToken, testUser } from '../../constants';

// TODO: Add more tests
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock implementation of AuthService methods
  const mockAuthService = {
    signIn: jest.fn(),
    setNewPassword: jest.fn(),
    changePassword: jest.fn(),
    forgotPassword: jest.fn(),
    confirmResetPassword: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // AuthService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const mockResponse = {
        AuthenticationResult: { AccessToken: testAccessToken },
      };
      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const result = await controller.signIn({
        email: testUser.email,
        password: testUser.password,
      });

      expect(authService.signIn).toHaveBeenCalledWith(
        testUser.email,
        testUser.password,
      );
      expect(result).toEqual(mockResponse); // Check that the correct response is returned
    });

    it('should throw an error if AuthService.signIn fails', async () => {
      mockAuthService.signIn.mockRejectedValue(new Error('Sign-in failed'));

      await expect(
        controller.signIn({
          email: testUser.email,
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(Error);
      expect(authService.signIn).toHaveBeenCalledWith(
        testUser.email,
        'wrongPassword',
      );
    });
  });

  describe('setNewPassword', () => {
    it('should call AuthService.setNewPassword with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      mockAuthService.setNewPassword.mockResolvedValue(mockResponse);

      const result = await controller.setNewPassword({
        email: testUser.email,
        password: 'newPassword',
        session: 'testSession',
      });

      expect(authService.setNewPassword).toHaveBeenCalledWith(
        testUser.email,
        'newPassword',
        'testSession',
      );
      expect(result).toEqual(mockResponse); // Check that the correct response is returned
    });

    it('should throw an error if AuthService.setNewPassword fails', async () => {
      mockAuthService.setNewPassword.mockRejectedValue(
        new Error('Set new password failed'),
      );

      await expect(
        controller.setNewPassword({
          email: testUser.email,
          password: 'newPassword',
          session: 'testSession',
        }),
      ).rejects.toThrow(Error);
      expect(authService.setNewPassword).toHaveBeenCalledWith(
        testUser.email,
        'newPassword',
        'testSession',
      );
    });
  });

  describe('changePassword', () => {
    it('should call AuthService.changePassword with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      mockAuthService.changePassword.mockResolvedValue(mockResponse);

      const result = await controller.changePassword({
        accessToken: testAccessToken,
        previousPassword: 'oldPassword',
        proposedPassword: 'newPassword',
      });

      expect(authService.changePassword).toHaveBeenCalledWith(
        testAccessToken,
        'oldPassword',
        'newPassword',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if AuthService.changePassword fails', async () => {
      mockAuthService.changePassword.mockRejectedValue(
        new Error('Change password failed'),
      );

      await expect(
        controller.changePassword({
          accessToken: testAccessToken,
          previousPassword: 'oldPassword',
          proposedPassword: 'newPassword',
        }),
      ).rejects.toThrow(Error);
      expect(authService.changePassword).toHaveBeenCalledWith(
        testAccessToken,
        'oldPassword',
        'newPassword',
      );
    });
  });

  describe('forgotPassword', () => {
    it('should call AuthService.forgotPassword with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await controller.forgotPassword({
        email: testUser.email,
      });

      expect(authService.forgotPassword).toHaveBeenCalledWith(testUser.email);
      expect(result).toEqual(mockResponse); // Check that the correct response is returned
    });

    it('should throw an error if AuthService.forgotPassword fails', async () => {
      mockAuthService.forgotPassword.mockRejectedValue(
        new Error('Forgot password failed'),
      );

      await expect(
        controller.forgotPassword({ email: testUser.email }),
      ).rejects.toThrow(Error);
      expect(authService.forgotPassword).toHaveBeenCalledWith(testUser.email);
    });
  });

  describe('confirmResetPassword', () => {
    it('should call AuthService.confirmResetPassword with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      mockAuthService.confirmResetPassword.mockResolvedValue(mockResponse);

      const result = await controller.confirmResetPassword({
        email: testUser.email,
        confirmationCode: '123456',
        newPassword: 'newPassword',
      });

      expect(authService.confirmResetPassword).toHaveBeenCalledWith(
        testUser.email,
        '123456',
        'newPassword',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if AuthService.confirmResetPassword fails', async () => {
      mockAuthService.confirmResetPassword.mockRejectedValue(
        new Error('Confirm reset password failed'),
      );

      await expect(
        controller.confirmResetPassword({
          email: testUser.email,
          confirmationCode: '123456',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(Error);
      expect(authService.confirmResetPassword).toHaveBeenCalledWith(
        testUser.email,
        '123456',
        'newPassword',
      );
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout with correct parameters', async () => {
      const mockResponse = {
        $metadata: {
          httpStatusCode: 200,
        },
      };
      mockAuthService.logout.mockResolvedValue(mockResponse);

      const result = await controller.logout({
        accessToken: testAccessToken,
      });

      expect(authService.logout).toHaveBeenCalledWith(testAccessToken);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if AuthService.logout fails', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Logout failed'));

      await expect(
        controller.logout({ accessToken: 'invalidToken' }),
      ).rejects.toThrow(Error);
      expect(authService.logout).toHaveBeenCalledWith('invalidToken');
    });
  });
});
