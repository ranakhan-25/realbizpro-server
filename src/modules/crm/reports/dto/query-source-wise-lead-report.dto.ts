import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QuerySourceWiseLeadReportDto {
  @ApiPropertyOptional({ example: '2026-09-28', description: 'Report start date' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-10-27', description: 'Report end date' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Assigned user UUID' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Lead source database ID' })
  @IsOptional() @IsString() declare leadSourceId?: string;
}
