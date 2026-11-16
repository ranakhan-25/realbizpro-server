import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePossessionRecordDto {
  @ApiProperty({
    description: 'Purchaser customer name',
    example: 'Dr. Nazmul Huda',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customer_name: string;

  @ApiProperty({
    description: 'Unit designation',
    example: 'B-4, Eastern Lakeview',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit_name: string;

  @ApiPropertyOptional({
    description: 'Project name',
    example: 'Eastern Lakeview',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  project_name?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Booking UUID',
  })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({
    description: 'Official Possession Certificate Number (auto-generated if omitted)',
    example: 'POS-CERT-2026-00412',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  possession_cert_no?: string;

  @ApiPropertyOptional({
    description: 'Possession handover date (YYYY-MM-DD)',
    example: '2026-10-15',
  })
  @IsOptional()
  @IsString()
  possession_date?: string;

  @ApiPropertyOptional({
    description: 'DLP Warranty Expiry Date (YYYY-MM-DD) - usually 2 years from possession',
    example: '2028-10-14',
  })
  @IsOptional()
  @IsString()
  dlp_expiry_date?: string;

  @ApiPropertyOptional({
    description: 'Key Register Number (auto-generated if omitted)',
    example: 'KEY-2026-00412',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  key_register_no?: string;

  @ApiPropertyOptional({
    description: 'Number of keys delivered to purchaser',
    example: 8,
    default: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  keys_delivered_count?: number;

  @ApiPropertyOptional({
    description: 'Electric Meter Reading at Handover',
    example: '14,208 kWh (DESCO Prepaid)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  electric_meter_reading?: string;

  @ApiPropertyOptional({
    description: 'Gas Meter / Cylinder System Status at Handover',
    example: 'Direct Cylinder System Active',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gas_meter_reading?: string;

  @ApiPropertyOptional({
    description: 'Water Meter Reading at Handover',
    example: '00,124 m³',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  water_meter_reading?: string;

  @ApiPropertyOptional({
    description: 'Whether customer signed the possession certificate & key receipt',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  signed_by_customer?: boolean;

  @ApiPropertyOptional({
    description: 'Remarks or hand-over notes',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
