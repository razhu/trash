import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneSendCodeRequestDto {
  @ApiProperty({
    description: 'The access token for the user',
    example: 'eyJraWQiOiJrM2F6Qn...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'The phone number to which the code will be sent',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;
}
