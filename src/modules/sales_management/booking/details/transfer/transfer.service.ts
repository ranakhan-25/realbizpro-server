/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingTransfer } from '../../../../../database/models/sales_management/sm_booking_transfer.model';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(BookingTransfer)
    private readonly transferModel: typeof BookingTransfer,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateTransferDto): Promise<BookingTransfer> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.transferModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.transferDate) data.transferDate = new Date(dto.transferDate);

      if (existing) {
        return existing.update(data);
      }
      return await this.transferModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save transfer.');
    }
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingTransfer> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.transferModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Transfer not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateTransferDto): Promise<BookingTransfer> {
    const record = await this.findOneByBooking(bookingId, uuid);
    
    const data: any = { ...dto };
    if (dto.transferDate) data.transferDate = new Date(dto.transferDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Transfer record deleted successfully' };
  }
}
