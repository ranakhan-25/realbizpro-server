import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCrInstallmentSetupDto {
  @ApiProperty({ example: 'PLAN-36M-STD', description: 'Unique plan code' })
  @IsString()
  @IsNotEmpty()
  plan_code: string;

  @ApiProperty({ example: '36-Month Standard Installment Plan' })
  @IsString()
  @IsNotEmpty()
  plan_name: string;

  @ApiProperty({ example: 36, description: 'Number of installments' })
  @IsNumber()
  @IsNotEmpty()
  number_of_installments: number;

  @ApiPropertyOptional({ example: 'monthly', enum: ['monthly', 'quarterly', 'semi_annual'] })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ example: 0.05, description: 'Penalty rate in percentage per period' })
  @IsNumber()
  @IsOptional()
  penalty_rate_percentage?: number;

  @ApiPropertyOptional({ example: 7, description: 'Grace period in days before penalty accrues' })
  @IsNumber()
  @IsOptional()
  grace_period_days?: number;

  @ApiPropertyOptional({ example: 'Standard plan for 3-year commercial plot purchase' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrInstallmentSetupDto extends PartialType(CreateCrInstallmentSetupDto) {}
