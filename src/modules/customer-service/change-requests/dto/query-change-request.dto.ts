import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryChangeRequestDto {
  @ApiPropertyOptional({
    description:
      'Filter by soft-deleted records (true/false)',
    default: false,
  })
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => {
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  is_deleted?: boolean;

  @ApiPropertyOptional({
    description:
      'Tab filter: all, pending, completed, deleted',
    default: 'all',
  })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({
    description: 'Specific status filter',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description:
      'Filter by request type (Ownership Transfer, Resale, etc.)',
  })
  @IsOptional()
  @IsString()
  request_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description:
      'Search across request code, customer name, unit, new buyer name, or project',
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
    description: 'Items per page (max 100)',
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
    description:
      'Sort column (created_at, applied_date, transfer_fee, request_code, id)',
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order (asc, desc)',
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';

  getOffset(): number {
    const curPage = Math.max(1, this.page || 1);
    const curLimit = Math.min(
      100,
      Math.max(1, this.limit || 10),
    );
    return (curPage - 1) * curLimit;
  }

  getPaginationMetadata(totalCount: number) {
    const curLimit = Math.min(
      100,
      Math.max(1, this.limit || 10),
    );
    const curPage = Math.max(1, this.page || 1);
    const totalPages = Math.max(
      1,
      Math.ceil(totalCount / curLimit),
    );
    return {
      total: totalCount,
      page: curPage,
      limit: curLimit,
      total_pages: totalPages,
    };
  }
}
