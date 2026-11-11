/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingTransfer } from '../../../../../database/models/sales_management/sm_booking_transfer.model';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingTransfer])],
  controllers: [TransferController],
  providers: [TransferService, BookingReferenceService],
  exports: [TransferService],
})
export class TransferModule {}
