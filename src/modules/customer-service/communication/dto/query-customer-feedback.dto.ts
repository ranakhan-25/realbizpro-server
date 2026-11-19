import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryCustomerFeedbackDto {
  @ApiPropertyOptional({ description: 'Search customer, phone, unit, feedback no, or comments' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'CamelCase project ID alias' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by survey type: Handover CSAT, Construction Update, DLP Resolution, Pre-Sales to Post-Sales' })
  @IsOptional()
  @IsString()
  survey_type?: string;

  @ApiPropertyOptional({ description: 'Filter by NPS category: Promoter, Passive, Detractor' })
  @IsOptional()
  @IsString()
  nps_category?: string;

  @ApiPropertyOptional({ description: 'Filter by follow-up status: Satisfied - Closed, Pending Review, Escalated to CX Head, Action Taken' })
  @IsOptional()
  @IsString()
  follow_up_status?: string;

  @ApiPropertyOptional({ description: 'Filter tab: all, promoters, passives, detractors, handover, dlp, escalated' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 'submitted_at' })
  @IsOptional()
  @IsString()
  sort_by?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Filter soft-deleted feedback' })
  @IsOptional()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  isDeleted?: boolean;
}
