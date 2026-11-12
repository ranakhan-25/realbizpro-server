/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingInstallment } from '../../../../../database/models/sales_management/sm_booking_installment.model';
import { InstallmentsService } from './installments.service';
import { InstallmentsController } from './installments.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingInstallment, Booking, MainBooking])],
  controllers: [InstallmentsController],
  providers: [InstallmentsService, BookingReferenceService],
  exports: [InstallmentsService],
})
export class InstallmentsModule {}
