import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum TicketSlaTabFilter {
  ALL = 'all',
  WITHIN = 'within',
  BREACHED = 'breached',
  APPROACHING = 'approaching',
  URGENT = 'urgent',
}

export class QueryServiceTicketSlaDto {
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
      'Filter by SLA status tab: all, within, breached, approaching, urgent',
    enum: TicketSlaTabFilter,
    default: TicketSlaTabFilter.ALL,
  })
  @IsOptional()
  @IsString()
  tab?: string = 'all';

  @ApiPropertyOptional({
    description: 'Alternative status filter parameter',
  })
  @IsOptional()
  @IsString()
  sla_status?: string;

  @ApiPropertyOptional({
    description: 'Filter by ticket category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description:
      'Search query across ticket number, customer name, unit, category, or assigned agent',
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
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order: ASC or DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
