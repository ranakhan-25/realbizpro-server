/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingHandover } from '../../../../../database/models/sales_management/sm_booking_handover.model';
import { HandoverService } from './handover.service';
import { HandoverController } from './handover.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingHandover])],
  controllers: [HandoverController],
  providers: [HandoverService, BookingReferenceService],
  exports: [HandoverService],
})
export class HandoverModule {}
