import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryTeamKpiReportDto {
  @ApiPropertyOptional({ example: '2026-10-01', description: 'Report period start date' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Report period end date' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by team ID' })
  @IsOptional() @IsString() declare teamId?: string;
}
