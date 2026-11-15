import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  UtilityTicketCategoryEnum,
  UtilityTicketPriorityEnum,
} from './create-utility-ticket.dto';

export class QueryUtilityTicketDto {
  @ApiPropertyOptional({
    description: 'Filter by deleted records (true/false)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }
    if (value === 'false' || value === false || value === 0 || value === '0') {
      return false;
    }
    return undefined;
  })
  @IsBoolean()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (maximum 100)',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search ticket number, customer name, unit, or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status tab: all, queue, open, assigned, in_progress, resolved, handed_over, closed',
  })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({
    description: 'Filter by workflow status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: UtilityTicketCategoryEnum,
  })
  @IsOptional()
  @IsEnum(UtilityTicketCategoryEnum)
  category?: UtilityTicketCategoryEnum;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: UtilityTicketPriorityEnum,
  })
  @IsOptional()
  @IsEnum(UtilityTicketPriorityEnum)
  priority?: UtilityTicketPriorityEnum;

  @ApiPropertyOptional({
    description: 'Filter by cost type: FREE or PAID',
  })
  @IsOptional()
  @IsString()
  cost_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by assigned technician ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  technician_id?: number;

  @ApiPropertyOptional({ description: 'Filter by Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Sort by field (default queue_serial for queue sequence)',
    default: 'queue_serial',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'queue_serial';

  @ApiPropertyOptional({
    description: 'Sort order (asc, desc) - asc ensures earlier claims first',
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'asc';

  getOffset(): number {
    const curPage = Math.max(1, this.page || 1);
    const curLimit = Math.min(100, Math.max(1, this.limit || 10));
    return (curPage - 1) * curLimit;
  }

  getPaginationMetadata(totalCount: number) {
    const curLimit = Math.min(100, Math.max(1, this.limit || 10));
    const curPage = Math.max(1, this.page || 1);
    const totalPages = Math.ceil(totalCount / curLimit) || 1;
    return {
      total: totalCount,
      page: curPage,
      limit: curLimit,
      total_pages: totalPages,
      has_next_page: curPage < totalPages,
      has_previous_page: curPage > 1,
    };
  }
}

