/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingHandover } from '../../../../../database/models/sales_management/sm_booking_handover.model';
import { CreateHandoverDto } from './dto/create-handover.dto';
import { UpdateHandoverDto } from './dto/update-handover.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class HandoverService {
  constructor(
    @InjectModel(BookingHandover)
    private readonly handoverModel: typeof BookingHandover,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateHandoverDto): Promise<BookingHandover> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.handoverModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.handoverDate) data.handoverDate = new Date(dto.handoverDate);
      
      // Sequelize handles JSON/Array casting automatically
      if (dto.checklist) data.checklist = dto.checklist;

      if (existing) {
        return existing.update(data);
      }
      return await this.handoverModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save handover.');
    }
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingHandover> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.handoverModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Handover not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateHandoverDto): Promise<BookingHandover> {
    const record = await this.findOneByBooking(bookingId, uuid);
    
    const data: any = { ...dto };
    if (dto.handoverDate) data.handoverDate = new Date(dto.handoverDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Handover record deleted successfully' };
  }
}
