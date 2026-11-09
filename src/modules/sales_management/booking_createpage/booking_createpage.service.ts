/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Booking, BookingStatus } from '../../../database/models/sales_management/sm_booking_create_model';
import { CreateBookingDto } from './dto/create-booking_createpage.dto';
import { UpdateBookingDto } from './dto/update-booking_createpage.dto';
import { QueryBookingDto } from './dto/query-booking_createpage.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    try {
      // Auto-generate Booking ID (e.g., BK-2026-XXXX)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BK-${new Date().getFullYear()}-${randomNum}`;

      return await this.bookingModel.create({
        ...dto,
        bookingId,
        visitDate: new Date(dto.visitDate),
        status: BookingStatus.PENDING, // Default
      } as any);
    } catch (error) {
      console.error("❌ Booking Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Booking ID already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create booking.');
    }
  }

  async findAll(query: QueryBookingDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { buyerName: { [Op.iLike]: `%${search}%` } },
        { bookingId: { [Op.iLike]: `%${search}%` } },
        { propertyName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.bookingModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ where: { uuid } });
    if (!booking) throw new NotFoundException(`Booking ${uuid} not found`);
    return booking;
  }

  async update(uuid: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.visitDate) {
      updateData.visitDate = new Date(dto.visitDate);
    }

    return booking.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const booking = await this.findOne(uuid);
    await booking.destroy();
    return { message: 'Booking deleted successfully' };
  }

  async restore(uuid: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ where: { uuid }, paranoid: false });
    if (!booking) throw new NotFoundException(`Booking ${uuid} not found`);
    if (!booking.deletedAt) throw new BadRequestException('Booking is not deleted');
    await booking.restore();
    return this.findOne(uuid);
  }
}