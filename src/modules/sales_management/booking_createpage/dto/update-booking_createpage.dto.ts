/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking_createpage.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '../../../../database/models/sales_management/sm_booking_create_model';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}