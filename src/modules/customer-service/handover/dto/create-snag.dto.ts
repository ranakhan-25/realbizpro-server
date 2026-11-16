import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSnagDto {
  @ApiProperty({
    description: 'Unit designation',
    example: 'C-9, Sheba Green',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit_name: string;

  @ApiProperty({
    description: 'Customer purchaser name',
    example: 'Barrister Shahed Chowdhury',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customer_name: string;

  @ApiProperty({
    description: 'Defect location in the unit',
    example: 'Dining Room Floor',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  defect_location: string;

  @ApiProperty({
    description: 'Defect description and remedial requirement',
    example: 'Hollow sound detected in 4 Italian tiles near south balcony entrance.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Severity (Minor, Major, Critical)',
    default: 'Minor',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  severity?: string;

  @ApiPropertyOptional({
    description: 'Assigned contractor / finishing crew',
    example: 'Mirpur Ceramic Works (Subcontractor)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assigned_contractor?: string;

  @ApiPropertyOptional({
    description: 'Target rectification deadline (YYYY-MM-DD)',
    example: '2026-11-20',
  })
  @IsOptional()
  @IsString()
  target_rectification_date?: string;

  @ApiPropertyOptional({
    description: 'Rectification status (Reported, In Rectification, Verified by Site Engr, Client Signed Off)',
    default: 'Reported',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  status?: string;

  @ApiPropertyOptional({
    description: 'Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Associated Handover ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  handover_id?: number;

  @ApiPropertyOptional({
    description: 'Associated Booking UUID',
  })
  @IsOptional()
  @IsString()
  booking_id?: string;

  @ApiPropertyOptional({
    description: 'Remarks or engineering notes',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
