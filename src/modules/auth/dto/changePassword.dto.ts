import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../validators';

export class ChangePasswordRequestDto {
  @ApiProperty({
    description: 'Access token required for authentication',
    example: 'eyJraWQiOiJrM2F6Qn...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPassword123!',
  })
  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number',
  })
  previousPassword: string;

  @ApiProperty({
    description: 'New password that the user wants to set',
    example: 'NewPassword123!',
  })
  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number',
  })
  proposedPassword: string;
}
