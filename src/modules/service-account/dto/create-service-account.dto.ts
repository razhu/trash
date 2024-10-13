import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/address';

// export enum PropertyType {
//   COMMERCIAL = 'commercial',
//   RESIDENTIAL = 'residential',
// }
export class CreateServiceAccountDto {
  @ApiProperty({
    description: 'Name of the property',
    example: 'Pando Headquarters',
  })
  @IsString()
  @IsNotEmpty()
  property_name: string;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Pando Inc.',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_name: string;

  @ApiProperty({
    description: 'Type of property',
    default: 'commercial',
  })
  property_type: string;

  @ApiProperty({ description: 'Address information' })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
