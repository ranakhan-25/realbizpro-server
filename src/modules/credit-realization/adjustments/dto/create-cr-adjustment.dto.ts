import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateCrAdjustmentDto {
  @ApiProperty({ example: 1, description: 'Sale Agreement ID' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sale_agreement_id: number;

  @ApiPropertyOptional({ example: 5, description: 'Optional specific installment plan ID' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  installment_plan_id?: number;

  @ApiProperty({
    example: 'credit_note',
    enum: ['credit_note', 'debit_note', 'rounding'],
    description: 'Adjustment type: credit note reduces due, debit note increases due, rounding settles fraction',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['credit_note', 'debit_note', 'rounding'])
  adjustment_type: string;

  @ApiProperty({ example: 5000, description: 'Adjustment amount in BDT' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 'Approved goodwill discount on early handover fee', description: 'Auditable reason for adjustment' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'CN-2026-0089', description: 'External reference number' })
  @IsString()
  @IsOptional()
  reference_no?: string;

  @ApiPropertyOptional({ example: 'Managing Director', description: 'Authorizer/approver title or name' })
  @IsString()
  @IsOptional()
  approved_by?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrAdjustmentDto extends PartialType(CreateCrAdjustmentDto) {}
