/* eslint-disable prettier/prettier */

import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/database/models/projects/task/pr_task.model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectTaskDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsUUID()
  @IsOptional()
  milestoneUuid?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsString()
  @IsOptional()
  search?: string; // Search by title, taskCode, or assignee

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