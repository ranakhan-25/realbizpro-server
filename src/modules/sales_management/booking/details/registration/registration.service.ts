/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingRegistration } from '../../../../../database/models/sales_management/sm_booking_registration.model';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(BookingRegistration)
    private readonly registrationModel: typeof BookingRegistration,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateRegistrationDto): Promise<BookingRegistration> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      const existing = await this.registrationModel.findOne({ where: { bookingId: bookingUuid } });
      
      const data: any = { ...dto };
      if (dto.registrationDate) data.registrationDate = new Date(dto.registrationDate);
      if (dto.mutationUpdatedDate) data.mutationUpdatedDate = new Date(dto.mutationUpdatedDate);

      if (existing) {
        return existing.update(data);
      }
      return await this.registrationModel.create({ ...data, bookingId: bookingUuid } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to save registration.');
    }
  }

  async findOneByBooking(bookingId: string, uuid: string): Promise<BookingRegistration> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.registrationModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Registration not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateRegistrationDto): Promise<BookingRegistration> {
    const record = await this.findOneByBooking(bookingId, uuid);
    
    const data: any = { ...dto };
    if (dto.registrationDate) data.registrationDate = new Date(dto.registrationDate);
    if (dto.mutationUpdatedDate) data.mutationUpdatedDate = new Date(dto.mutationUpdatedDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const record = await this.findOneByBooking(bookingId, uuid);
    await record.destroy();
    return { message: 'Registration record deleted successfully' };
  }
}
