/* eslint-disable prettier/prettier */
import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { MilestoneStatus } from 'src/database/models/projects/project_milestone/pr_project_milestone_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectMilestoneDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}