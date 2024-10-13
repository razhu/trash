import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { ApiProperty } from '@nestjs/swagger';
import { User as UserType } from '@prisma/client';
import { IsEmail, IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../validators';

export class SignUpVerifyRequestDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@pando.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'Password123!',
  })
  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmation code sent to the user for verification',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: `User's timezone`,
    example: 'UTC',
  })
  @IsString()
  timezone: string;
}

export class SignUpVerifyResponseDto {
  @ApiProperty({
    description: 'User object containing user details',
  })
  user: UserType;

  @ApiProperty({
    description:
      'Authentication token returned upon successful signup confirmation',
  })
  token: AuthenticationResultType;
}
