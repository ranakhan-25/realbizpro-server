/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingDocument } from '../../../../../database/models/sales_management/sm_booking_document.model';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { BookingReferenceService } from '../../booking-reference.service';

@Module({
  imports: [SequelizeModule.forFeature([BookingDocument])],
  controllers: [DocumentsController],
  providers: [DocumentsService, BookingReferenceService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
