/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from '../../../database/models/sales_management/sm_booking_create_model';
import { BookingService } from './booking_createpage.service';
import { BookingController } from './booking_createpage.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingCreatepageModule {}