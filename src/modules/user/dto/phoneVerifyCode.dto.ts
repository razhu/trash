import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneVerifyCodeRequestDto {
  @ApiProperty({
    description: 'The access token for the user',
    example: 'eyJraWQiOiJrM2F6Qn...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: "The verification code sent to the user's phone",
    example: '123456',
  })
  @IsString()
  code: string;
}
