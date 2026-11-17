/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BookingApproval, ApprovalStatus } from '../../../database/models/sales_management/sm_approvals_model';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';
import { BookingReferenceService } from '../booking/booking-reference.service';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectModel(BookingApproval)
    private readonly approvalModel: typeof BookingApproval,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async upsert(bookingId: string, dto: CreateApprovalDto): Promise<BookingApproval> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);

    const data: any = { ...dto };
    if (dto.approvedDate) data.approvedDate = new Date(dto.approvedDate);

    const existing = await this.approvalModel.findOne({ where: { bookingId: bookingUuid } });
    if (existing) return existing.update(data);
    
    return this.approvalModel.create({ ...data, bookingId: bookingUuid } as any);
  }

  async findByBooking(bookingId: string): Promise<BookingApproval> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.approvalModel.findOne({ where: { bookingId: bookingUuid } });
    if (!record) throw new NotFoundException('Approval record not found for this booking');
    return record;
  }

  async update(bookingId: string, uuid: string, dto: UpdateApprovalDto): Promise<BookingApproval> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.approvalModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Approval not found');

    const data: any = { ...dto };
    if (dto.approvedDate) data.approvedDate = new Date(dto.approvedDate);

    return record.update(data);
  }

  async remove(bookingId: string, uuid: string): Promise<{ message: string }> {
    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.approvalModel.findOne({ where: { bookingId: bookingUuid, uuid } });
    if (!record) throw new NotFoundException('Approval not found');

    await record.destroy();
    return { message: 'Approval deleted successfully' };
  }
}
