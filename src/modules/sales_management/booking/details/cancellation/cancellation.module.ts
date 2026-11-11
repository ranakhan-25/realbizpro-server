/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingCancellation } from '../../../../../database/models/sales_management/sm_booking_cancellation.model';
import { CancellationService } from './cancellation.service';
import { CancellationController } from './cancellation.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingCancellation])],
  controllers: [CancellationController],
  providers: [CancellationService, BookingReferenceService],
  exports: [CancellationService],
})
export class CancellationModule {}
