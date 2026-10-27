import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryTaskVisitSummaryReportDto {
  @ApiPropertyOptional({ description: 'Include activities on or after this date', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Include activities on or before this date', example: '2026-10-27' })
  @IsOptional()
  @IsDateString()
  declare dateTo?: string;
}
