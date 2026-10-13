import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateCrmTaskDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  task_type_id?: number;

  @ApiProperty({ example: 'Follow up with client regarding quotation discount' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Verify if 5% discount is approved by management' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: '2026-10-20T17:00:00Z' })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: 'todo', enum: ['todo', 'in_progress', 'completed'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  related_lead_id?: number;

  @ApiPropertyOptional({ example: ['USR-001', 'USR-002'], description: 'User IDs to assign' })
  @IsArray()
  @IsOptional()
  assignee_ids?: string[];

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrmTaskDto extends PartialType(CreateCrmTaskDto) {}
