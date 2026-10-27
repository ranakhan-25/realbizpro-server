import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class QueryTeamSummaryReportDto {
  @ApiPropertyOptional({ example: '2026-09-29', description: 'Report start date' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-10-28', description: 'Report end date' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Team database ID from the dropdown API' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare teamId?: number;
}
