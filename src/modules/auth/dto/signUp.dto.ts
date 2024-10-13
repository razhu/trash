import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, Matches } from 'class-validator';
import { passwordRegex } from '../../../validators';

export class SignUpRequestDto {
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
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Whether the user accepted the terms and conditions',
    example: true,
  })
  @IsBoolean()
  termsAccepted: boolean;
}

export class SignUpResponseDto {
  @ApiProperty({
    description: 'Cognito ID assigned to the user upon successful registration',
    example: '34c834c8-f051-...',
  })
  cognitoSub: string;
}
