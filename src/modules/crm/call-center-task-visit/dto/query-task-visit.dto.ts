import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class QueryTaskVisitDto {
  @ApiPropertyOptional({ example: '2026-09-28' }) @IsOptional() @IsDateString() declare dateFrom?: string;
  @ApiPropertyOptional({ example: '2026-10-27' }) @IsOptional() @IsDateString() declare dateTo?: string;
  @ApiPropertyOptional({ description: 'Conducting user UUID or user code' }) @IsOptional() @IsString() declare userId?: string;
  @ApiPropertyOptional({ description: 'CRM visit place ID' }) @IsOptional() @Type(() => Number) @IsInt() declare placeId?: number;
  @ApiPropertyOptional({ description: 'CRM visit status ID' }) @IsOptional() @Type(() => Number) @IsInt() declare statusId?: number;
  @ApiPropertyOptional({ description: 'Lead stage ID used as the sales possibility filter' }) @IsOptional() @Type(() => Number) @IsInt() declare salesPossibilityId?: number;
  @ApiPropertyOptional({ enum: ['visit', 'task_visit'] }) @IsOptional() @IsString() declare taskType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 10, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
