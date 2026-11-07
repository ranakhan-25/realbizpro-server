import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryUserWiseReportDto {
  @ApiPropertyOptional({ example: '2026-09-28', description: 'Report start date' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-10-27', description: 'Report end date' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Assigned user UUID' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Lead source database ID' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare leadSourceId?: number;

  @ApiPropertyOptional({ description: 'Campaign database ID' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare campaignId?: number;

  @ApiPropertyOptional({ description: 'Team database ID' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare teamId?: number;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
