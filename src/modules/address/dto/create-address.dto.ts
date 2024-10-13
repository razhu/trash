import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

// export enum AddressType {
//   BILLING = 'billing',
//   MAILING = 'mailing',
// }
export class CreateAddressDto {
  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street_address: string;

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
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Postal Code', example: '10001' })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  longitude?: number;
}
