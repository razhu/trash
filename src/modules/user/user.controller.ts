import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  PhoneSendCodeRequestDto,
  VerifyEmailRequestDto,
  PhoneVerifyCodeRequestDto,
  SaveUserVehicleRequestDto,
  VerifyEmailResponseDto,
  AccountStatusResponseDto,
} from './dto';
import { UserService } from './user.service';
import { Public, User } from '../../common/decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User as UserType } from '@prisma/client';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('email/check')
  @ApiResponse({
    type: VerifyEmailResponseDto,
  })
  async verifyEmail(
    @Query() verifyEmailRequestDto: VerifyEmailRequestDto,
  ): Promise<VerifyEmailResponseDto> {
    const { email } = verifyEmailRequestDto;
    return this.userService.verifyEmail(email);
  }

  @ApiBearerAuth()
  @Get('/account/status')
  @ApiResponse({
    type: AccountStatusResponseDto,
  })
  async getUserAccountStatus(
    @User() user: UserType,
  ): Promise<AccountStatusResponseDto> {
    return this.userService.getUserAccountStatus(user.id);
  }

  @ApiBearerAuth()
  @Post('/account/activate')
  async activateUserAccount(@User() user: UserType) {
    return this.userService.activateUserAccount(user.id);
  }

  @ApiBearerAuth()
  @Post('vehicle')
  async saveUserVehicle(
    @User() user: UserType,
    @Body() saveUserVehicleRequestDto: SaveUserVehicleRequestDto,
  ) {
    const { vehicleId } = saveUserVehicleRequestDto;
    return this.userService.saveUserVehicle(user.id, vehicleId);
  }

  @ApiBearerAuth()
  @Post('phone')
  async sendPhoneCode(
    @Body() phoneSendCodeRequestDto: PhoneSendCodeRequestDto,
  ) {
    const { accessToken, phoneNumber } = phoneSendCodeRequestDto;
    return this.userService.sendPhoneCode(accessToken, phoneNumber);
  }

  @ApiBearerAuth()
  @Post('phone/verify-code')
  async verifyPhoneCode(
    @User() user: UserType,
    @Body() phoneVerifyCodeRequestDto: PhoneVerifyCodeRequestDto,
  ) {
    const { accessToken, code } = phoneVerifyCodeRequestDto;
    return this.userService.verifyPhoneCode(accessToken, code, user.id);
  }
}
