import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class QueryFollowUpDetailsReportDto {
  @ApiPropertyOptional({ example: '2026-09-28' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-10-27' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Assigned user UUID' })
  @IsOptional() @IsUUID() declare userId?: string;

  @ApiPropertyOptional({ description: 'CRM lead UUID' })
  @IsOptional() @IsUUID() declare leadId?: string;

  @ApiPropertyOptional({ description: 'Lead stage id or UUID' })
  @IsOptional() @IsString() declare leadStageId?: string;

  @ApiPropertyOptional({ description: 'Communication status UUID or name' })
  @IsOptional() @IsString() declare communicationStatus?: string;

  @ApiPropertyOptional({ description: 'Searches lead name, phone, note, comment, project and flat/land' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
