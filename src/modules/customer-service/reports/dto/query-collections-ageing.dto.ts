import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum AgeingBracketFilter {
  ALL = 'all',
  CRITICAL = 'critical',
  SIXTY_TO_NINETY = '61to90',
  THIRTY_TO_SIXTY = '31to60',
  CURRENT = 'current',
  NOTICES = 'notices',
}

export class QueryCollectionsAgeingDto {
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
      'Filter by Ageing Bracket tab: all, critical, 61to90, 31to60, current, notices',
    enum: AgeingBracketFilter,
    default: AgeingBracketFilter.ALL,
  })
  @IsOptional()
  @IsString()
  bracket?: string = 'all';

  @ApiPropertyOptional({
    description: 'Alternative tab filter parameter',
  })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({
    description:
      'Search query across customer name, phone, unit number, project name, or recovery officer',
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
    default: 'overdue_days',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'overdue_days';

  @ApiPropertyOptional({
    description: 'Sort order: ASC or DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
