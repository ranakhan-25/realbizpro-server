/* eslint-disable prettier/prettier */

import {
  IsString,
  IsOptional,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from '../../../../../database/models/sales_management/sm_pay_commission.model'; // âœ… à¦‡à¦®à¦ªà§‹à¦°à§à¦Ÿ

export class QueryPayCommissionDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}