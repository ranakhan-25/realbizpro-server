/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingAgreement } from '../../../../../database/models/sales_management/sm_booking_agreement.model';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { BookingReferenceService } from '../../booking-reference.service';
import { BookingCreate as Booking } from '../../../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../../../database/models/sales_management/sm_main_booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingAgreement, Booking, MainBooking])],
  controllers: [AgreementController],
  providers: [AgreementService, BookingReferenceService],
  exports: [AgreementService],
})
export class AgreementModule {}
