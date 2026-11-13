/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BookingInstallment } from '../../../../../database/models/sales_management/sm_booking_installment.model';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { QueryInstallmentDto } from './dto/query-installment.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class InstallmentsService {
  constructor(
    @InjectModel(BookingInstallment)
    private readonly installmentModel: typeof BookingInstallment,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async create(bookingId: string, dto: CreateInstallmentDto): Promise<BookingInstallment> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      return await this.installmentModel.create({
        ...dto,
        bookingId: bookingUuid,
        dueDate: new Date(dto.dueDate),
        paidDate: dto.paidDate ? new Date(dto.paidDate) : undefined,
      } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to create installment.');
    }
  }

  async findAllByBooking(bookingId: string, query: QueryInstallmentDto) {
    const { page = '1', limit = '10', search, status } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const where: any = { bookingId: bookingUuid };
    
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.installmentModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['due_date', 'ASC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, bookingId?: string): Promise<BookingInstallment> {
    const where: any = { uuid };
    if (bookingId) where.bookingId = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.installmentModel.findOne({ where });
    if (!record) throw new NotFoundException(`Installment ${uuid} not found`);
    return record;
  }

  async update(uuid: string, dto: UpdateInstallmentDto): Promise<BookingInstallment> {
    const record = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);
    if (dto.paidDate) updateData.paidDate = new Date(dto.paidDate);

    return record.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const record = await this.findOne(uuid);
    await record.destroy(); // Soft delete (paranoid: true)
    return { message: 'Installment deleted successfully' };
  }
}
