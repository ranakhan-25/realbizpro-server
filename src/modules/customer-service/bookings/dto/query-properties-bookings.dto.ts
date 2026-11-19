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

export enum BookingTabFilter {
  ALL = 'all',
  SNAGGING = 'snagging',
  DLP = 'dlp',
  HANDEDOVER = 'handedover',
  UNDER_CONSTRUCTION = 'under_construction',
}

export enum BookingSortBy {
  BOOKING_DATE = 'booking_date',
  CUSTOMER_NAME = 'customer_name',
  TOTAL_PRICE = 'total_price',
  PAID_AMOUNT = 'paid_amount',
  DUE_AMOUNT = 'due_amount',
  CREATED_AT = 'created_at',
}

export class QueryPropertiesBookingsDto {
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
      'Search query across booking code, customer name, phone, project name, or unit number',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Portfolio tab filter',
    enum: BookingTabFilter,
    default: BookingTabFilter.ALL,
  })
  @IsOptional()
  @IsEnum(BookingTabFilter)
  tab?: BookingTabFilter = BookingTabFilter.ALL;

  @ApiPropertyOptional({
    description: 'Filter by Project UUID',
  })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description:
      'Filter by Customer UUID or Customer Profile ID',
  })
  @IsOptional()
  @IsString()
  customer_id?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: BookingSortBy,
    default: BookingSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(BookingSortBy)
  sort_by?: BookingSortBy =
    BookingSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort order (ASC, DESC)',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Filter soft-deleted bookings' })
  @IsOptional()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  isDeleted?: boolean;

  getOffset(): number {
    return (
      (Math.max(1, this.page || 1) - 1) *
      Math.max(1, this.limit || 10)
    );
  }
}
