import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({
    description: 'Address ID',
    example: '7c993e35-0c0f-4b4f-b8c9-c4f26168990c',
  })
  id: string;

  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  street_address: string;

  @ApiProperty({
    description: 'Secondary street address (optional)',
    example: 'Apt 4B',
    required: false,
  })
  street_address_2?: string;

  @ApiProperty({ description: 'City', example: 'San Francisco' })
  city: string;

  @ApiProperty({ description: 'State', example: 'CA' })
  state: string;

  @ApiProperty({ description: 'Postal Code', example: '94105' })
  postal_code: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  country: string;

  @ApiProperty({ description: 'Latitude', required: false, example: null })
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false, example: null })
  longitude?: number;

  @ApiProperty({ description: 'Address type', example: 'mailing' })
  type: string;

  @ApiProperty({
    description: 'User who created the address',
    example: '84e44176-b700-41ee-a308-30b59cb7efca',
  })
  created_by: string;

  @ApiProperty({
    description: 'User who last modified the address',
    example: null,
  })
  modified_by?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-10-11T15:56:46.473Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last modification timestamp',
    example: '2024-10-11T15:56:46.473Z',
  })
  modified_at: Date;
}
