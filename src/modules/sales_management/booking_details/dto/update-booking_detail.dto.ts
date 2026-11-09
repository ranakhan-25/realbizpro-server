/* eslint-disable prettier/prettier */

import { 
  IsString, IsEnum, IsOptional, IsNumber, IsEmail, IsISO8601 
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../../../database/models/sales_management/sm_booking_details_model';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsISO8601({ strict: true })
  @IsOptional()
  visitDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerNid?: string;

  @IsString()
  @IsOptional()
  propertyName?: string;

  @IsString()
  @IsOptional()
  propertyCategory?: string;

  @IsString()
  @IsOptional()
  propertySize?: string;

  @IsString()
  @IsOptional()
  propertyFacing?: string;

  @IsString()
  @IsOptional()
  propertyPlotNo?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tax?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  paidAmount?: number;

  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  agentName?: string;

  @IsString()
  @IsOptional()
  agentEmail?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}