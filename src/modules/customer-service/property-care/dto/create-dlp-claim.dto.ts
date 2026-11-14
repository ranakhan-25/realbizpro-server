import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  DlpDefectCategory,
  DlpSeverity,
} from 'src/database/models/customer-service/cs_property_care.types';

export class CreateDlpClaimDto {
  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Project Name' })
  @IsOptional()
  @IsString()
  project_name?: string;

  @ApiPropertyOptional({ description: 'Flat Land Booking UUID' })
  @IsOptional()
  @IsUUID()
  booking_id?: string;

  @ApiPropertyOptional({ description: 'Customer Profile ID' })
  @IsOptional()
  @IsNumber()
  customer_profile_id?: number;

  @ApiProperty({ description: 'Customer / Purchaser Name' })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({ description: 'Unit number / name' })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiPropertyOptional({ description: 'Possession Date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  possession_date?: string;

  @ApiPropertyOptional({ description: 'DLP Expiry Date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dlp_expiry_date?: string;

  @ApiPropertyOptional({ enum: DlpDefectCategory, default: DlpDefectCategory.WATER_SEEPAGE })
  @IsOptional()
  @IsEnum(DlpDefectCategory)
  defect_category?: DlpDefectCategory;

  @ApiPropertyOptional({ enum: DlpSeverity, default: DlpSeverity.MAJOR })
  @IsOptional()
  @IsEnum(DlpSeverity)
  severity?: DlpSeverity;

  @ApiPropertyOptional({ description: 'Assigned Engineer / Contractor Name' })
  @IsOptional()
  @IsString()
  assigned_engineer?: string;

  @ApiPropertyOptional({ description: 'Assigned Engineer User ID' })
  @IsOptional()
  @IsNumber()
  assigned_engineer_id?: number;

  @ApiPropertyOptional({ description: 'Rectification notes / defect remarks' })
  @IsOptional()
  @IsString()
  rectification_notes?: string;
}
