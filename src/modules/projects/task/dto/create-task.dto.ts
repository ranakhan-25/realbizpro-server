/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/database/models/projects/task/pr_task.model';


export class CreateTaskDto {
  @ApiPropertyOptional({
    description: 'Unique identifier / UID',
    example: 'UID-101',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  uid?: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Roof Casting',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Task name is required',
  })
  taskName: string;

  @ApiPropertyOptional({
    description: 'Task progress percentage',
    example: 25,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number = 0;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task start date',
    example: '2026-01-10',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Task end date',
    example: '2026-03-10',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Task duration',
    example: '60 Days',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  duration?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Task completion date',
    example: '2026-03-10',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  completeDate?: string;

  @ApiPropertyOptional({
    description: 'Task budget',
    example: 5000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Task cost',
    example: 3000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Created by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Deleted by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  deletedBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}