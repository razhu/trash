import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  @IsOptional()
  street_address?: string;

  @ApiProperty({
    description: 'Secondary street address (optional)',
    example: 'Apt 4B',
    required: false,
  })
  @IsOptional()
  @IsString()
  street_address_2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Postal Code', example: '10001' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  longitude?: number;
}
