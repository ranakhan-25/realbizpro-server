/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingCancellation } from '../../../../../database/models/sales_management/sm_booking_cancellation.model';
import { CreateCancellationDto } from './dto/create-cancellation.dto';
import { UpdateCancellationDto } from './dto/update-cancellation.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class CancellationService {
  constructor(
    @InjectModel(BookingCancellation)
    private readonly cancellationModel: typeof BookingCancellation,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateCancellationDto): Promise<BookingCancellation> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.cancellationModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.cancellationDate) data.cancellationDate = new Date(dto.cancellationDate);
      if (dto.refundDate) data.refundDate = new Date(dto.refundDate);

      if (existing) {
        return existing.update(data);
      }
      return await this.cancellationModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save cancellation.');
    }
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingCancellation> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.cancellationModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Cancellation not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateCancellationDto): Promise<BookingCancellation> {
    const record = await this.findOneByBooking(bookingId, uuid);
    
    const data: any = { ...dto };
    if (dto.cancellationDate) data.cancellationDate = new Date(dto.cancellationDate);
    if (dto.refundDate) data.refundDate = new Date(dto.refundDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Cancellation record deleted successfully' };
  }
}
