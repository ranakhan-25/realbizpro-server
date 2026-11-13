/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingCancellation } from 'src/database/models/sales_management/sm_booking_cancellation.model';
import { BookingCreate } from 'src/database/models/sales_management/sm_booking_create_model';
import { BookingReferenceService } from '../../booking-reference.service';
import { CreateCancellationDto } from './dto/create-cancellation.dto';
import { UpdateCancellationDto } from './dto/update-cancellation.dto';

@Injectable()
export class CancellationService {
  constructor(
    @InjectModel(BookingCancellation)
    private readonly cancellationModel: typeof BookingCancellation,
    
    // ✅ মেইন বুকিং মডেল ইনজেক্ট করুন (প্রপার্টি ও বায়ারের নাম পাওয়ার জন্য)
    @InjectModel(BookingCreate)
    private readonly bookingModel: typeof BookingCreate,

    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingUuid: string, dto: CreateCancellationDto
  ) {
    try {
      // ১. প্রথমে মূল বুকিং টেবিল থেকে ডাটা বের করুন
      const booking = await this.bookingModel.findOne({
        where: { uuid: bookingUuid },
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      // ২. চেক করুন আগে থেকেই কোনো ক্যান্সেলেশন রেকর্ড আছে কিনা
      const existing = await this.cancellationModel.findOne({
        where: { bookingId: bookingUuid },
      });

      // ৩. ডাটা প্রিপেয়ার করুন (যাতে null না যায়)
      const dataToSave: any = {
        ...dto,
        bookingId: bookingUuid,
        // যদি ডাটাবেসে বাধ্যতামূলক হয়, তবে ডিফল্ট ভ্যালু দিন
        cancellationId: dto.cancellationId || `CXL-${Date.now()}`,
        propertyName: dto.propertyName || booking.propertyName || 'N/A',
        buyerName: dto.buyerName || booking.buyerName || 'N/A',
      };

      if (existing) {
        return await existing.update(dataToSave);
      }

      return await this.cancellationModel.create(dataToSave);
    } catch (error: any) {
      console.error('❌ Cancellation Upsert Error:', error);
      throw new BadRequestException(error.message || 'Failed to save cancellation');
    }
  }

  async findOneByBooking(bookingUuid: string, uuid: string): Promise<BookingCancellation> {
    const record = await this.cancellationModel.findOne({
      where: { bookingId: bookingUuid, uuid },
    });
    if (!record) throw new NotFoundException('Cancellation not found for this booking');
    return record;
  }

  async update(
    bookingUuid: string,
    uuid: string,
    dto: UpdateCancellationDto,
  ): Promise<BookingCancellation> {
    const record = await this.findOneByBooking(bookingUuid, uuid);
    const data: any = { ...dto };

    if (dto.cancellationDate) data.cancellationDate = new Date(dto.cancellationDate);
    if (dto.refundDate) data.refundDate = new Date(dto.refundDate);

    return record.update(data);
  }

  async remove(bookingUuid: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingUuid, uuid);
    await record.destroy();
    return { message: 'Cancellation record deleted successfully' };
  }
}
