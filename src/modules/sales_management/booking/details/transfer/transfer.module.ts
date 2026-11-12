/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingTransfer } from '../../../../../database/models/sales_management/sm_booking_transfer.model';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingTransfer, Booking, MainBooking])],
  controllers: [TransferController],
  providers: [TransferService, BookingReferenceService],
  exports: [TransferService],
})
export class TransferModule {}
