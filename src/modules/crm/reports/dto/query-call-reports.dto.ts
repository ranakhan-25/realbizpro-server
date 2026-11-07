import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsInt } from 'class-validator';

export class QueryCallReportsDto {
  @ApiPropertyOptional({ description: 'Include calls on or after this date', example: '2026-10-01' })
  @IsOptional()
  @IsDateString()
  declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Include calls on or before this date', example: '2026-10-27' })
  @IsOptional()
  @IsDateString()
  declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
