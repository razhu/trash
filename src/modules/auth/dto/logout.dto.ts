import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty({
    description: 'Access token of the user to be logged out',
    example: 'eyJraWQiOiJrM2F6Qn...',
  })
  @IsString()
  accessToken: string;
}
