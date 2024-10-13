import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmailRequestDto {
  @ApiProperty({
    description: 'The Email to verify',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: `Indicates whether the email exists in the db`,
    example: true,
  })
  emailExistsInDB: boolean;
}
