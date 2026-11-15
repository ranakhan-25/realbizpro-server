/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingRegistration } from '../../../../../database/models/sales_management/sm_booking_registration.model';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingRegistration, Booking, MainBooking])],
  controllers: [RegistrationController],
  providers: [RegistrationService, BookingReferenceService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
