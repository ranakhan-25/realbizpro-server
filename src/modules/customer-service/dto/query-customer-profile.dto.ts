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

export class QueryCustomerProfileDto {
  @ApiPropertyOptional({
    description:
      'Filter by deleted records (true/false)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (
      value === 'true' ||
      value === true ||
      value === 1 ||
      value === '1'
    ) {
      return true;
    }
    if (
      value === 'false' ||
      value === false ||
      value === 0 ||
      value === '0'
    ) {
      return false;
    }
    return undefined;
  })
  @IsBoolean()
  is_deleted?: boolean;
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
    description:
      'Number of items per page (maximum 100)',
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
      'Search query for name, phone, NID, or nominee',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Filter by customer status (all, vip, active, disputed, closed)',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
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
