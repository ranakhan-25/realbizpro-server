import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryProcurementAssetCategoryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @ApiPropertyOptional({ default: 10, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 10;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) skip?: number;
  @ApiPropertyOptional({ example: 'Vehicle' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: ['createdAt', 'updatedAt', 'type', 'code', 'name'] }) @IsOptional() @IsIn(['createdAt', 'updatedAt', 'type', 'code', 'name']) sortBy = 'createdAt';
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' }) @IsOptional() @IsIn(['ASC', 'DESC']) sortOrder: 'ASC' | 'DESC' = 'DESC';
  @ApiPropertyOptional({ default: false }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() withDeleted = false;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
