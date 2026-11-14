import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  DlpDefectCategory,
  DlpSeverity,
  DlpClaimStatus,
} from 'src/database/models/customer-service/cs_property_care.types';

export class QueryDlpClaimDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term (claim_no, customer_name, unit, project_name)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter tab (all, active, resolved)' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ enum: DlpDefectCategory })
  @IsOptional()
  @IsEnum(DlpDefectCategory)
  defect_category?: DlpDefectCategory;

  @ApiPropertyOptional({ enum: DlpSeverity })
  @IsOptional()
  @IsEnum(DlpSeverity)
  severity?: DlpSeverity;

  @ApiPropertyOptional({ enum: DlpClaimStatus })
  @IsOptional()
  @IsEnum(DlpClaimStatus)
  status?: DlpClaimStatus;
}
