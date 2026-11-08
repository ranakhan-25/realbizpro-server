import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export const INTERNAL_TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical', 'Urgent'] as const;
export const INTERNAL_TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Testing', 'Completed', 'Cancelled', 'Pending', 'Delayed'] as const;

export class CreateInternalTaskDto {
  @ApiProperty({ example: 'Prepare sales report', maxLength: 255 })
  @IsString() @IsNotEmpty() @MaxLength(255)
  declare title: string;

  @ApiPropertyOptional({ description: 'Project code selected from the project dropdown', example: 'PRJ-101' })
  @IsOptional() @IsString() @MaxLength(255)
  declare projectCode?: string;

  @ApiPropertyOptional({ example: 'Follow up on the requested documents' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiProperty({ type: [String], description: 'Assigned user codes from the assignee dropdown', example: ['USR-LEGAL-01'] })
  @IsArray() @ArrayNotEmpty() @ArrayUnique() @IsString({ each: true }) @MaxLength(255, { each: true })
  declare assignedTo: string[];

  @ApiProperty({ enum: INTERNAL_TASK_PRIORITIES, default: 'Medium' })
  @IsIn(INTERNAL_TASK_PRIORITIES)
  declare priority: typeof INTERNAL_TASK_PRIORITIES[number];

  @ApiProperty({ enum: INTERNAL_TASK_STATUSES, default: 'Todo' })
  @IsIn(INTERNAL_TASK_STATUSES)
  declare status: typeof INTERNAL_TASK_STATUSES[number];

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional() @IsDateString()
  declare dueDate?: string;

  @ApiPropertyOptional({ description: 'Task Type UUID, when assigning a configured type' })
  @IsOptional() @IsUUID()
  declare taskTypeUuid?: string;

  @ApiPropertyOptional({ description: 'Related CRM Lead UUID' })
  @IsOptional() @IsUUID()
  declare relatedLeadUuid?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt()
  declare orgId?: number;
}
