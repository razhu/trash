import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from 'src/modules/address';

export class ServiceAccountResponseDto {
  @ApiProperty({ description: 'ID of the service account', example: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Name of the property',
    example: 'Office Space A',
  })
  property_name: string;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Tech Solutions Inc.',
    required: false,
  })
  company_name?: string;

  @ApiProperty({
    description: 'Type of property',
    example: 'commercial',
  })
  property_type: string;

  @ApiProperty({
    description: '8-digit code for the service account',
    example: 1,
  })
  code: number;

  @ApiProperty({ description: 'User ID of the creator', example: 'uuid' })
  created_by: string;

  @ApiProperty({
    description: 'User ID of the last modifier',
    example: 'uuid',
    required: false,
  })
  modified_by?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-10-11T15:56:46.508Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last modification date',
    example: '2024-10-11T15:56:46.508Z',
  })
  modified_at: Date;

  @ApiProperty({
    description: 'address id',
    example: '7c993e35-0c0f-4b4f-b8c9-c4f26168990c',
  })
  address_id: string;

  @ApiProperty({ description: 'Address information' })
  address: AddressResponseDto;
}
