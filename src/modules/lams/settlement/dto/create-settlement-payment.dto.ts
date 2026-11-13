import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettlementPaymentDto {
  @ApiProperty({ description: 'Disbursement payment amount in BDT', example: 10000000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ description: 'Payment date', example: '2026-10-10' })
  @IsDateString()
  @IsOptional()
  payment_date?: string;

  @ApiProperty({ description: 'Payment mode', example: 'Bank Transfer' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiPropertyOptional({ description: 'Cheque or bank transaction reference number', example: 'CHQ-8941029' })
  @IsString()
  @IsOptional()
  reference_no?: string;

  @ApiPropertyOptional({ description: 'Installment number', example: 1 })
  @IsNumber()
  @IsOptional()
  installment_no?: number;

  @ApiPropertyOptional({ description: 'Payment notes and observations' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Scanned receipt URL or attachment' })
  @IsString()
  @IsOptional()
  receipt_url?: string;
}
