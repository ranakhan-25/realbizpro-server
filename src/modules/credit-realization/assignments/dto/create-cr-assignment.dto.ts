import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateCrAssignmentDto {
  @ApiProperty({ example: 'OFF-101', description: 'Officer employee ID' })
  @IsString()
  @IsNotEmpty()
  officer_id: string;

  @ApiProperty({ example: 'Tanvir Hossain', description: 'Officer name' })
  @IsString()
  @IsNotEmpty()
  officer_name: string;

  @ApiProperty({ example: 1, description: 'Sale Agreement ID' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sale_agreement_id: number;

  @ApiProperty({ example: 150000, description: 'Target collection amount in BDT' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  target_amount: number;

  @ApiPropertyOptional({ example: 0, description: 'Already collected amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  collected_amount?: number;

  @ApiProperty({ example: '2026-11-30', description: 'Due date for target collection' })
  @IsDateString()
  @IsNotEmpty()
  due_date: string;

  @ApiPropertyOptional({ example: '2026-11-01', description: 'Assignment date' })
  @IsDateString()
  @IsOptional()
  assignment_date?: string;

  @ApiPropertyOptional({
    example: 'assigned',
    enum: ['assigned', 'in_progress', 'completed', 'overdue'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['assigned', 'in_progress', 'completed', 'overdue'])
  status?: string;

  @ApiPropertyOptional({ example: 'Target overdue installment collection' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrAssignmentDto extends PartialType(CreateCrAssignmentDto) {}
