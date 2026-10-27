import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class QueryCallCenterFollowUpDto {
  @ApiPropertyOptional({ example: '2026-09-27' }) @IsOptional() @IsDateString() declare dateFrom?: string;
  @ApiPropertyOptional({ example: '2026-10-26' }) @IsOptional() @IsDateString() declare dateTo?: string;
  @ApiPropertyOptional({ description: 'Interested project UUID' }) @IsOptional() @IsUUID() declare projectId?: string;
  @ApiPropertyOptional({ description: 'Lead owner UUID' }) @IsOptional() @IsUUID() declare userId?: string;
  @ApiPropertyOptional({ description: 'Filters the activity type/status column' }) @IsOptional() @IsString() declare activityType?: string;
  @ApiPropertyOptional({ description: 'Communication outcome, persisted in the existing activity discussion_points field' }) @IsOptional() @IsString() declare communicationStatus?: string;
  @ApiPropertyOptional({ description: 'Filters the lead status column' }) @IsOptional() @IsString() declare leadStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 10, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
