/* eslint-disable prettier/prettier */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../../../database/models/sales_management/sm_pay_commission.model'; // âœ… à¦‡à¦®à¦ªà§‹à¦°à§à¦Ÿ

export class CreatePayCommissionDto {
  @IsString()
  agentId: string;

  @IsString()
  agentName: string;

  @IsString()
  @IsOptional()
  agentRole?: string;

  @IsString()
  @IsOptional()
  agentAvatar?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNo?: string;

  @IsString()
  @IsOptional()
  branch?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @IsString()
  @IsOptional()
  dealIds?: string;

  @IsString()
  @IsOptional()
  dealBreakdown?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  acknowledged?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
}