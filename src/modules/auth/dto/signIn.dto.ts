import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { ApiProperty } from '@nestjs/swagger';
import { User as UserType } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    description: 'Email of the user signing in',
    example: 'user@pando.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user signing in',
    example: 'Password123!',
  })
  @IsString()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty({
    description: 'User object containing user details',
  })
  user: UserType;

  @ApiProperty({
    description:
      'Authentication token returned upon successful signup confirmation',
  })
  token: AuthenticationResultType;

  @ApiProperty({
    description: 'The name of the challenge returned by Cognito, if any',
    required: false,
  })
  challengeName?: string;

  @ApiProperty({
    description:
      'The session identifier for the current authentication session, if any',
    required: false,
  })
  session?: string;
}
