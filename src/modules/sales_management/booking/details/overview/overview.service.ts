/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingOverview } from '../../../../../database/models/sales_management/sm_booking_overview.model';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class OverviewService {
  constructor(
    @InjectModel(BookingOverview)
    private readonly overviewModel: typeof BookingOverview,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateOverviewDto): Promise<BookingOverview> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const existing = await this.overviewModel.findOne({ where: { bookingId: bookingUuid } });

    const data: any = { ...dto };
    if (dto.nextDueDate) data.nextDueDate = new Date(dto.nextDueDate);

    if (existing) return existing.update(data);
    return this.overviewModel.create({ ...data, bookingId: bookingUuid } as any);
  }

  // ✅ নতুন — overviewUuid ছাড়া
  async findFirstByBooking(bookingId: string): Promise<BookingOverview> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.overviewModel.findOne({ where: { bookingId: bookingUuid } });
    if (!record) throw new NotFoundException('Overview not found for this booking');
    return record;
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingOverview> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.overviewModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Overview not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateOverviewDto): Promise<BookingOverview> {
    const record = await this.findOneByBooking(bookingId, uuid);
    const data: any = { ...dto };
    if (dto.nextDueDate) data.nextDueDate = new Date(dto.nextDueDate);
    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Overview deleted successfully' };
  }
}