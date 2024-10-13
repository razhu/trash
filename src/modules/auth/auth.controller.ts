import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInRequestDto,
  SetNewPasswordRequestDto,
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ConfirmResetPasswordRequestDto,
  LogoutRequestDto,
  SignUpRequestDto,
  SignUpResponseDto,
  SignInResponseDto,
  SignUpVerifyResponseDto,
  SignUpVerifyRequestDto,
} from './dto';
import { Public } from '../../common/decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../enums';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This endpoint is for EV Driver sign up through mobile only
  @Public()
  @Post('signup')
  @ApiResponse({
    type: SignUpResponseDto,
  })
  async signUp(
    @Body() signUpRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const { firstName, lastName, email, password, termsAccepted } =
      signUpRequestDto;
    return this.authService.signUp(
      firstName,
      lastName,
      email,
      password,
      termsAccepted,
      UserRole.EV_DRIVER,
    );
  }

  // This endpoint is for EV Driver sign up through mobile only
  @Public()
  @Post('signup/verify-code')
  @ApiResponse({
    type: SignUpVerifyResponseDto,
  })
  async verifySignUp(
    @Body() signUpVerifyRequestDto: SignUpVerifyRequestDto,
  ): Promise<SignUpVerifyResponseDto> {
    const { email, password, code, timezone } = signUpVerifyRequestDto;
    return this.authService.verifySignUp(email, password, code, timezone);
  }

  @Public()
  @Post('signin')
  @ApiResponse({
    type: SignInResponseDto,
  })
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const { email, password } = signInRequestDto;
    return this.authService.signIn(email, password);
  }

  @Public()
  @Post('set-new-password')
  async setNewPassword(
    @Body() setNewPasswordRequestDto: SetNewPasswordRequestDto,
  ) {
    const { email, password, session } = setNewPasswordRequestDto;
    return this.authService.setNewPassword(email, password, session);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordRequestDto: ChangePasswordRequestDto,
  ) {
    const { accessToken, previousPassword, proposedPassword } =
      changePasswordRequestDto;
    return this.authService.changePassword(
      accessToken,
      previousPassword,
      proposedPassword,
    );
  }

  @Public()
  @Post('forgot-password')
  @ApiResponse({
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordRequestDto;
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('confirm-reset-password')
  async confirmResetPassword(
    @Body() confirmResetPasswordRequestDto: ConfirmResetPasswordRequestDto,
  ) {
    const { email, confirmationCode, newPassword } =
      confirmResetPasswordRequestDto;
    return this.authService.confirmResetPassword(
      email,
      confirmationCode,
      newPassword,
    );
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(@Body() logoutRequestDto: LogoutRequestDto) {
    const { accessToken } = logoutRequestDto;
    return this.authService.logout(accessToken);
  }
}
