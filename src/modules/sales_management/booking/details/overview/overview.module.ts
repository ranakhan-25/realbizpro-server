/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingOverview } from '../../../../../database/models/sales_management/sm_booking_overview.model';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingOverview])],
  controllers: [OverviewController],
  providers: [OverviewService, BookingReferenceService],
  exports: [OverviewService],
})
export class OverviewModule {}
