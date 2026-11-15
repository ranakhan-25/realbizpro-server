import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class QueryTaskVisitSummaryReportDto {
  @ApiPropertyOptional({ description: 'Include activities on or after this date', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Include activities on or before this date', example: '2026-10-27' })
  @IsOptional()
  @IsDateString()
  declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
