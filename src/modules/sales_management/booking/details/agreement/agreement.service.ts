/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingAgreement } from '../../../../../database/models/sales_management/sm_booking_agreement.model';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class AgreementService {
  constructor(
    @InjectModel(BookingAgreement)
    private readonly agreementModel: typeof BookingAgreement,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateAgreementDto): Promise<BookingAgreement> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.agreementModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.agreementDate) data.agreementDate = new Date(dto.agreementDate);

      if (existing) {
        return existing.update(data);
      }
      return await this.agreementModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save agreement.');
    }
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingAgreement> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.agreementModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Agreement not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateAgreementDto): Promise<BookingAgreement> {
    const record = await this.findOneByBooking(bookingId, uuid);
    
    const data: any = { ...dto };
    if (dto.agreementDate) data.agreementDate = new Date(dto.agreementDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Agreement deleted successfully' };
  }
}
