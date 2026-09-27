import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class PaginateDto {
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
    description: 'Number of items per page',
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
    description: 'Search query string',
  })
  @IsOptional()
  search?: string;

  // Helper method to get offset for database queries
  getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  // Helper method to get pagination metadata
  getPaginationMetadata(totalItems: number) {
    return {
      page: this.page,
      limit: this.limit,
      totalItems,
      totalPages: Math.ceil(
        totalItems / this.limit,
      ),
      hasNextPage:
        this.page <
        Math.ceil(totalItems / this.limit),
      hasPreviousPage: this.page > 1,
    };
  }
}
