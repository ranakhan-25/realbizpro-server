/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApprovalController } from './approvals.controller';
import { ApprovalService } from './approvals.service';
import { BookingApproval } from '../../../database/models/sales_management/sm_approvals_model';
import { BookingCreate as Booking } from '../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../database/models/sales_management/sm_main_booking.model';
import { BookingReferenceService } from '../booking/booking-reference.service';

@Module({
  imports: [
    SequelizeModule.forFeature([BookingApproval, Booking, MainBooking]),
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService, BookingReferenceService],
  exports: [ApprovalService],
})
export class ApprovalModule {}
