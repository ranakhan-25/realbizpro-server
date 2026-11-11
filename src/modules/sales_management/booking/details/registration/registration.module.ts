/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingRegistration } from '../../../../../database/models/sales_management/sm_booking_registration.model';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingRegistration])],
  controllers: [RegistrationController],
  providers: [RegistrationService, BookingReferenceService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
