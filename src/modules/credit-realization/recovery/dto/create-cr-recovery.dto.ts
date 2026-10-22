import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateCrRecoveryLogDto {
  @ApiPropertyOptional({ example: 1, description: 'Sale Agreement ID' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sale_agreement_id?: number;

  @ApiPropertyOptional({ example: 'CUST-0089' })
  @IsString()
  @IsOptional()
  customer_id?: string;

  @ApiPropertyOptional({
    example: 'phone_call',
    enum: [
      'phone_call',
      'reminder_letter_1',
      'reminder_letter_2',
      'legal_notice',
      'in_person_visit',
    ],
  })
  @IsString()
  @IsOptional()
  action_type?: string;

  @ApiPropertyOptional({ example: '2026-10-14T11:00:00Z' })
  @IsDateString()
  @IsOptional()
  action_date?: string;

  @ApiPropertyOptional({ example: '2026-10-25' })
  @IsDateString()
  @IsOptional()
  promised_payment_date?: string;

  @ApiPropertyOptional({ example: 125000 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  promised_amount?: number;

  @ApiPropertyOptional({ example: 'S. M. Faruk (Recovery Officer)' })
  @IsString()
  @IsOptional()
  officer_name?: string;

  @ApiPropertyOptional({
    example: 'Client stated money transfer from overseas expected by 25th Oct',
  })
  @IsString()
  @IsOptional()
  customer_response?: string;

  @ApiPropertyOptional({
    example: 'promised',
    enum: ['promised', 'disputed', 'unreachable', 'resolved', 'in_progress'],
  })
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional({
    example: 'resolved',
    description: 'Outcome status alias from frontend forms',
  })
  @IsString()
  @IsOptional()
  outcome_status?: string;

  @ApiPropertyOptional({ example: '2026-10-26' })
  @IsDateString()
  @IsOptional()
  next_action_date?: string;

  @ApiPropertyOptional({
    example: '2026-10-26',
    description: 'Next follow-up date alias from frontend forms',
  })
  @IsDateString()
  @IsOptional()
  next_followup_date?: string;

  @ApiPropertyOptional({
    example: 'Customer promised payment by next Monday',
    description: 'Remarks alias from frontend forms',
  })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({
    example: 'LN-2026-004',
    description: 'Legal notice reference number',
  })
  @IsString()
  @IsOptional()
  legal_notice_ref?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrRecoveryLogDto extends PartialType(CreateCrRecoveryLogDto) {}
