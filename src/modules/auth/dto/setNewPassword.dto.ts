import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../validators';

export class SetNewPasswordRequestDto {
  @ApiProperty({
    description: 'Email of the user setting a new password',
    example: 'user@pando.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'New password that the user wants to set',
    example: 'NewPassword123!',
  })
  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'Session identifier for the user session',
    example: 'sessionId123',
  })
  @IsString()
  session: string;
}
