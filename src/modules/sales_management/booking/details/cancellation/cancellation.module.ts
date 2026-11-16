/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingCancellation } from '../../../../../database/models/sales_management/sm_booking_cancellation.model';
import { CancellationService } from './cancellation.service';
import { CancellationController } from './cancellation.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingCancellation, Booking, MainBooking])],
  controllers: [CancellationController],
  providers: [CancellationService, BookingReferenceService],
  exports: [CancellationService],
})
export class CancellationModule {}
