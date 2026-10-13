import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateCrRecoveryLogDto {
  @ApiProperty({ example: 1, description: 'Sale Agreement ID' })
  @IsNumber()
  @IsNotEmpty()
  sale_agreement_id: number;

  @ApiPropertyOptional({ example: 'CUST-0089' })
  @IsString()
  @IsOptional()
  customer_id?: string;

  @ApiProperty({
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
  @IsIn([
    'phone_call',
    'reminder_letter_1',
    'reminder_letter_2',
    'legal_notice',
    'in_person_visit',
  ])
  action_type: string;

  @ApiProperty({ example: '2026-10-14T11:00:00Z' })
  @IsDateString()
  action_date: string;

  @ApiPropertyOptional({ example: '2026-10-25' })
  @IsDateString()
  @IsOptional()
  promised_payment_date?: string;

  @ApiPropertyOptional({ example: 125000 })
  @IsNumber()
  @IsOptional()
  promised_amount?: number;

  @ApiProperty({ example: 'S. M. Faruk (Recovery Officer)' })
  @IsString()
  @IsNotEmpty()
  officer_name: string;

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

  @ApiPropertyOptional({ example: '2026-10-26' })
  @IsDateString()
  @IsOptional()
  next_action_date?: string;

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
