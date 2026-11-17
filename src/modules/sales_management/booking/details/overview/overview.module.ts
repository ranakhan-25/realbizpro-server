/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingOverview } from '../../../../../database/models/sales_management/sm_booking_overview.model';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingOverview, Booking, MainBooking])],
  controllers: [OverviewController],
  providers: [OverviewService, BookingReferenceService],
  exports: [OverviewService],
})
export class OverviewModule {}
