import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CancellationsController } from './cencellationview.controller';
import { CencellationviewService } from './cencellationview.service';
import { Cancellation } from '../../../database/models/sales_management/sm_cencellationview.model';
import { BookingCreate as Booking } from '../../../database/models/sales_management/sm_booking_create_model';

@Module({
  imports: [SequelizeModule.forFeature([Cancellation, Booking])],
  controllers: [CancellationsController],
  providers: [CencellationviewService],
  exports: [CencellationviewService, SequelizeModule],
})
export class CencellationviewModule {}
