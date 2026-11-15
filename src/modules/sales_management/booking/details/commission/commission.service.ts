/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingCommission } from '../../../../../database/models/sales_management/sm_booking_commission.model';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class CommissionService {
  constructor(
    @InjectModel(BookingCommission)
    private readonly commissionModel: typeof BookingCommission,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateCommissionDto): Promise<BookingCommission> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.commissionModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.paidDate) data.paidDate = new Date(dto.paidDate);

      if (existing) {
        return existing.update(data);
      }
      return await this.commissionModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save commission.');
    }
  }

  async findOneByBooking(bookingId: string): Promise<BookingCommission> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.commissionModel.findOne({ where: { bookingId: bookingUuid } });
    if (!record) throw new NotFoundException('Commission not found for this booking');
    return record;
  }

  async update(bookingId: string, dto: UpdateCommissionDto): Promise<BookingCommission> {
    const record = await this.findOneByBooking(bookingId);
    
    const data: any = { ...dto };
    if (dto.paidDate) data.paidDate = new Date(dto.paidDate);

    return record.update(data);
  }

  async remove(bookingId: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId);
    await record.destroy();
    return { message: 'Commission record deleted successfully' };
  }
}
