import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryCallLogReportDto {
  @ApiPropertyOptional({ description: 'Include calls on or after this date', example: '2026-09-29' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Include calls on or before this date', example: '2026-10-28' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by user UUID, user code or user name' })
  @IsOptional() @IsString() declare userId?: string;
}
