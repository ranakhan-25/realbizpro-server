import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ProjectStatusEnum } from 'src/database/models/projects/pr_project_model';

export class QueryProjectDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'head office',
    description: 'Search by name, code, location, contractor, contact person etc.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ProjectStatusEnum,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status?: ProjectStatusEnum;

  @ApiPropertyOptional({
    example: 'Office',
    description: 'Filter by project type',
  })
  @IsOptional()
  @IsString()
  projectType?: string;

  @ApiPropertyOptional({
    example: 'Central',
    description: 'Filter by area category',
  })
  @IsOptional()
  @IsString()
  areaCategory?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Include soft-deleted projects',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  withDeleted?: boolean = false;
}