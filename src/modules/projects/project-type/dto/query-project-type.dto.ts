import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryProjectTypeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Search box: code ba name diye search
  @IsOptional()
  @IsString()
  search?: string;

  // Table header sort (ID, CODE, NAME)
  @IsOptional()
  @IsIn(['id', 'code', 'name'])
  sortBy?: 'id' | 'code' | 'name' = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}