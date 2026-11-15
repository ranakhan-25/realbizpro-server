import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class GetPaymentVouchersQueryDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // Filters
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  workId?: string;

  @IsOptional()
  @IsString()
  siteId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  // Date Range
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate?: string;
  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

}