import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryHandoverScheduleDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by Project UUID' })
  @IsOptional()
  @IsString()
  project_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by handover status tab: ready, snags, completed, all',
  })
  @IsOptional()
  @IsString()
  tab?: string;

  @ApiPropertyOptional({ description: 'Specific handover status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search purchaser, unit, or code' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter soft-deleted handover records' })
  @IsOptional()
  is_deleted?: boolean;

  @ApiPropertyOptional({ description: 'CamelCase alias' })
  @IsOptional()
  isDeleted?: boolean;
}
