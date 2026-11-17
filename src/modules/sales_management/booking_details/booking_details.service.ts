/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BookingDetails as Booking } from '../../../database/models/sales_management/sm_booking_details_model';
import { UpdateBookingDto } from './dto/update-booking_detail.dto';
import { QueryBookingDto } from './dto/query-booking_detail.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  // ✅ নতুন যোগ করা create মেথড (অটোমেটিক কোড জেনারেট করে)
  async create(dto: any): Promise<Booking> {
    // ইউনিক বুকিং কোড তৈরি
    const generatedCode = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      return await this.bookingModel.create({
        ...dto,
        bookingCode: generatedCode, // এখানে কোডটি সেট করা হলো
      });
    } catch (error: any) {
      console.error("❌ Booking Create Error:", error);
      throw new BadRequestException(error?.message || 'Failed to create booking.');
    }
  }

  async findAll(query: QueryBookingDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { bookingId: { [Op.iLike]: `%${search}%` } },
        { buyerName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.bookingModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
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

    try {
      await booking.update(updateData);
      return this.findOne(uuid);
    } catch (error: any) {
      console.error("❌ Booking Update Error:", error);
      throw new BadRequestException(error?.message || 'Failed to update booking.');
    }
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