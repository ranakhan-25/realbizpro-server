/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsEnum 
} from 'class-validator';
import { BookingStatus } from '../../../../database/models/sales_management/sm_booking_create_model';

export class QueryBookingDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}