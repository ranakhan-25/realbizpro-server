import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { ProjectStatus } from 'src/database/models/projects/project/pr_project.model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectDto extends PaginateDto {
  @IsOptional()
  @IsString()
  declare search?: string;

  @IsOptional()
  @IsString()
  declare projectType?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  declare status?: ProjectStatus;

  @IsOptional()
  @IsString()
  declare areaCategory?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  declare numberOfStoreys?: number;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
