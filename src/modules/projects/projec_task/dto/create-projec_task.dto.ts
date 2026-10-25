/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsInt, 
  Min, 
  ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from 'src/database/models/projects/project-task/pr_project-task_model';

export class CreateProjectTaskDto { 
  // ১. projectUuid সবসময় UUID হতে হবে (এখানে ValidateIf এর দরকার নেই)
  @IsUUID()
  projectUuid: string;

  // ২. milestoneUuid এর ওপরে ValidateIf বসবে
  @ValidateIf((o) => o.milestoneUuid !== null && o.milestoneUuid !== undefined && o.milestoneUuid !== '')
  @IsUUID()
  @IsOptional()
  milestoneUuid?: string;

  @IsString()
  taskCode: string;

  @IsString()
  title: string;

  @IsString()
  assignee: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: '2026-10-24T00:00:00.000Z', format: 'date-time' })
  @IsDateString()
  dueDate: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  reminderBefore?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}