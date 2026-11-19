import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryMutationTrackingDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({ description: 'Search app no, customer, unit, or office' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by land office stage' })
  @IsOptional()
  @IsString()
  current_stage?: string;

  @ApiPropertyOptional({ description: 'Tab filter: all | hearing | inquiry | approved' })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Filter soft-deleted records only' })
  @IsOptional()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  isDeleted?: boolean;
}
