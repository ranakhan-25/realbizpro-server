import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryCallLogDetailsReportDto {
  @ApiPropertyOptional({ description: 'Include calls on or after this date', example: '2026-09-29' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Include calls on or before this date', example: '2026-10-28' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by user UUID, user code or user name' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Search number, lead name, call type or user name' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
