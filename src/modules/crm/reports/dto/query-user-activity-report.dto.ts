import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryUserActivityReportDto {
  @ApiPropertyOptional({ example: '2026-09-28' }) @IsOptional() @IsDateString() declare dateFrom?: string;
  @ApiPropertyOptional({ example: '2026-10-27' }) @IsOptional() @IsDateString() declare dateTo?: string;
  @ApiPropertyOptional({ description: 'Filter by assigned/conducted user UUID' }) @IsOptional() @IsString() declare userId?: string;
  @ApiPropertyOptional({ description: 'Filter by lead stage database ID' }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadStageId?: number;
  @ApiPropertyOptional({ description: 'Filter by visit status database ID' }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare visitStatusId?: number;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 25, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare limit?: number;
}
