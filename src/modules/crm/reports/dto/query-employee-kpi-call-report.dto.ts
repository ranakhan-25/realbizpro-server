import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsInt } from 'class-validator';

export class QueryEmployeeKpiCallReportDto {
  @ApiPropertyOptional({ example: '2026-07-01', description: 'Report period start date' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-07-31', description: 'Report period end date' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by employee UUID, user code or name' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
