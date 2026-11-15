import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WarrantyCategoryEnum {
  ELECTRICAL = 'Electrical',
  PLUMBING = 'Plumbing',
  SANITARY = 'Sanitary',
  WATER_FITTINGS = 'Water Fittings',
  OTHER = 'Other',
}

export class CreateWarrantyItemDto {
  @ApiProperty({ description: 'Project UUID to scope the warranty fixture' })
  @IsNotEmpty()
  @IsUUID('4')
  project_id: string;

  @ApiProperty({ description: 'Flat or unit number', example: 'Flat 7-A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit: string;

  @ApiPropertyOptional({ description: 'Flat owner customer name' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customer_name?: string;

  @ApiPropertyOptional({ description: 'Customer profile primary key ID' })
  @IsOptional()
  @IsInt()
  customer_profile_id?: number;

  @ApiProperty({
    description: 'Warranty item name (switch, socket, tap, shower, fittings ONLY)',
    example: 'Schneider 16A 3-Pin Socket with Switch',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  item_name: string;

  @ApiProperty({
    description: 'Equipment category',
    enum: WarrantyCategoryEnum,
    example: WarrantyCategoryEnum.ELECTRICAL,
  })
  @IsNotEmpty()
  @IsEnum(WarrantyCategoryEnum)
  category: WarrantyCategoryEnum;

  @ApiProperty({ description: 'Manufacturer brand', example: 'Schneider Electric' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  brand: string;

  @ApiPropertyOptional({ description: 'Model or catalog number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  model_no?: string;

  @ApiPropertyOptional({ description: 'Barcode or equipment serial number' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serial_number?: string;

  @ApiProperty({
    description: 'Location inside the unit',
    example: 'Master Bathroom / Kitchen Counter',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  location: string;

  @ApiPropertyOptional({ description: 'Quantity installed', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number = 1;

  @ApiProperty({
    description: 'Warranty effective start date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  warranty_start_date: string;

  @ApiProperty({
    description: 'Warranty expiry end date (YYYY-MM-DD)',
    example: '2028-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  warranty_end_date: string;

  @ApiPropertyOptional({ description: 'Coverage details or warranty terms' })
  @IsOptional()
  @IsString()
  coverage_details?: string;
}

