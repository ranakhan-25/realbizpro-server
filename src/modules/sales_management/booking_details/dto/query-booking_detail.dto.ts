/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsOptional, 
  IsNumberString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { BookingStatus } from '../../../../database/models/sales_management/sm_booking_details_model';

export class QueryBookingDto {
  @IsUUID()
  @IsOptional()
  uuid?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
