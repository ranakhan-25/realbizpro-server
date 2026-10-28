import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryMissedFollowupVisitSummaryDto {
  @ApiPropertyOptional({ example: '2026-10-28', description: 'Report date (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  declare date?: string;

  @ApiPropertyOptional({ type: Number, description: 'Team database ID from the dropdown API' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare teamId?: number;

  @ApiPropertyOptional({ description: 'User UUID or user code from the dropdown API' })
  @IsOptional() @IsString()
  declare userId?: string;

  @ApiPropertyOptional({ description: 'Search by team or employee name' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare limit?: number;
}
