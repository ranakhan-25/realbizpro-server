/* eslint-disable prettier/prettier */

import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApproveStatus, PaymentStatus } from 'src/database/models/projects/Requisition/pr_fund_requisition_model';


export class CreateFundRequisitionDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  projectType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  taskId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  siteId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fromUserId?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number;

  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;

  @IsOptional()
  @IsEnum(ApproveStatus)
  approveStatus?: ApproveStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addedById?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  createdBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  updatedBy?: string;
}
