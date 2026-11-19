import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum HandoverReportTabFilter {
  ALL = 'all',
  ONGOING = 'ongoing',
  HANDED = 'handed',
  ASSOCIATION = 'association',
}

export class QueryHandoverPropertyCareDto {
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

  @ApiPropertyOptional({
    description:
      'Filter by status tab: all, ongoing, handed, association',
    enum: HandoverReportTabFilter,
    default: HandoverReportTabFilter.ALL,
  })
  @IsOptional()
  @IsString()
  status?: string = 'all';

  @ApiPropertyOptional({
    description: 'Alternative tab filter parameter',
  })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({
    description: 'Search query across project name or location',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page (max 100)',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort by field name',
    default: 'projectName',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'projectName';

  @ApiPropertyOptional({
    description: 'Sort order: ASC or DESC',
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'ASC';
}
