import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { User as UserType } from '@prisma/client';
import { CodeDeliveryDetailsType } from '@aws-sdk/client-cognito-identity-provider';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    description: 'Email of the user requesting a password reset',
    example: 'user@pando.com',
  })
  @IsEmail()
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'User object containing user details',
  })
  user: Pick<
    UserType,
    'email' | 'first_name' | 'last_name' | 'profile_image_url'
  >;
  codeDeliveryDetails: CodeDeliveryDetailsType;
}
