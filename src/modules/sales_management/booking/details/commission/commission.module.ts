/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingCommission } from '../../../../../database/models/sales_management/sm_booking_commission.model';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingCommission])],
  controllers: [CommissionController],
  providers: [CommissionService, BookingReferenceService],
  exports: [CommissionService],
})
export class CommissionModule {}
