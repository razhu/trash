import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';

export class TermsAndConditionsResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the terms and conditions document',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The content of the terms and conditions in JSON format',
    example: [
      {
        title: 'Service Agreement of Pando Electric Inc',
        content: ['Welcome to Pando Electric Inc!...'],
      },
    ],
  })
  content: JsonValue;

  @ApiProperty({
    description: 'The version number of the terms and conditions',
    example: 1,
  })
  version: number;
}
