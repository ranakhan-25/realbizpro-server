import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryJunkLeadDto {
  @ApiPropertyOptional({ description: 'Start date (inclusive), YYYY-MM-DD' })
  @IsOptional() @IsString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'End date (inclusive), YYYY-MM-DD' })
  @IsOptional() @IsString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by lead category ID' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadCategoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by assigned user UUID' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;

  @ApiPropertyOptional({ description: 'Search lead name, phone, code, organization, address, or note' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
