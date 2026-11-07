import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateCrPaymentDto {
  @ApiProperty({ example: 'VCHR-2026-9001', description: 'Unique payment voucher number' })
  @IsString()
  @IsNotEmpty()
  payment_voucher_no: string;

  @ApiProperty({ example: 125000, description: 'Principal installment amount being paid' })
  @IsNumber()
  @IsNotEmpty()
  paid_amount: number;

  @ApiPropertyOptional({ example: 1500, description: 'Penalty amount paid' })
  @IsNumber()
  @IsOptional()
  penalty_paid?: number;

  @ApiProperty({ example: '2026-10-14', description: 'Payment date (YYYY-MM-DD)' })
  @IsDateString()
  payment_date: string;

  @ApiProperty({
    example: 'bank_transfer',
    enum: ['cash', 'bank_transfer', 'cheque', 'mfs'],
  })
  @IsString()
  @IsIn(['cash', 'bank_transfer', 'cheque', 'mfs'])
  payment_method: string;

  @ApiPropertyOptional({ example: 'Eastern Bank Ltd.' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ example: 'CHQ-889922' })
  @IsString()
  @IsOptional()
  cheque_no?: string;

  @ApiPropertyOptional({ example: '2026-10-14' })
  @IsDateString()
  @IsOptional()
  cheque_date?: string;

  @ApiPropertyOptional({ example: 'TXN-EBL-992288' })
  @IsString()
  @IsOptional()
  transaction_reference?: string;

  @ApiPropertyOptional({ example: 'MR-004488' })
  @IsString()
  @IsOptional()
  money_receipt_no?: string;

  @ApiPropertyOptional({ example: 'Payment verified and cleared' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class WaivePenaltyDto {
  @ApiProperty({ example: 500, description: 'Amount of delay penalty to waive' })
  @IsNumber()
  @IsNotEmpty()
  amount_to_waive: number;

  @ApiPropertyOptional({ example: 'Management approved 50% penalty waiver' })
  @IsString()
  @IsOptional()
  reason?: string;
}
