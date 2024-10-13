import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../validators';

export class ConfirmResetPasswordRequestDto {
  @ApiProperty({
    description: 'Email of the user whose password is being reset',
    example: 'user@pando.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Confirmation code sent to the user to verify the reset request',
    example: '123456',
  })
  @IsString()
  confirmationCode: string;

  @ApiProperty({
    description: 'New password that the user wants to set',
    example: 'NewPassword123!',
  })
  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number',
  })
  newPassword: string;
}
