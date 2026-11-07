import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryCallAssignHistoryDto {
  @ApiPropertyOptional({ example: '2026-09-27', description: 'Assignment date lower bound (inclusive)' }) @IsOptional() @IsDateString() declare dateFrom?: string;
  @ApiPropertyOptional({ example: '2026-10-26', description: 'Assignment date upper bound (inclusive)' }) @IsOptional() @IsDateString() declare dateTo?: string;
  @ApiPropertyOptional({ description: 'Filter by assigning user UUID or user code' }) @IsOptional() @IsString() declare from?: string;
  @ApiPropertyOptional({ description: 'Filter by assigned user UUID or user code' }) @IsOptional() @IsString() declare to?: string;
  @ApiPropertyOptional({ description: 'Filter by communication status UUID or label' }) @IsOptional() @IsString() declare communicationStatus?: string;
  @ApiPropertyOptional({ description: 'Filter by organization ID' }) @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ default: 1, minimum: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare limit?: number;
}
