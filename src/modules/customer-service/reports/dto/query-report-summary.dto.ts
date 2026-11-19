import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryReportSummaryDto {
  @ApiPropertyOptional({
    description: 'Filter by Project UUID (snake_case)',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by Project UUID (camelCase alternative)',
  })
  @IsOptional()
  @IsString()
  projectId?: string;
}
