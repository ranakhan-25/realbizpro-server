/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingInstallment } from '../../../../../database/models/sales_management/sm_booking_installment.model';
import { InstallmentsService } from './installments.service';
import { InstallmentsController } from './installments.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingInstallment])],
  controllers: [InstallmentsController],
  providers: [InstallmentsService, BookingReferenceService],
  exports: [InstallmentsService],
})
export class InstallmentsModule {}
