/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateDiscountDto } from './dto/create-discounts_form.dto';
import { UpdateDiscountDto } from './dto/update-discounts_form.dto';
import { QueryDiscountDto } from './dto/query-discounts_form.dto';
import { Discount } from 'src/database/models/sales_management/sm_discount.model';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount)
    private readonly discountModel: typeof Discount,
  ) {}

  async create(dto: CreateDiscountDto): Promise<Discount> {
    try {
      return await this.discountModel.create({
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      } as any);
    } catch (error: any) {
      console.error('❌ Discount Create Error:', error);
      throw new BadRequestException(
        error?.message || 'Failed to create discount.',
      );
    }
  }

  async findAll(query: QueryDiscountDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};

    // ✅ FIX: Cast filters to any to avoid TS index signature error
    Object.keys(filters).forEach((k) => {
      const value = (filters as any)[k];
      if (value !== undefined && value !== null && value !== '') {
        where[k] = value;
      }
    });

    if (search) {
      where[Op.or] = [
        { propertyName: { [Op.iLike]: `%${search}%` } },
        { reason: { [Op.iLike]: `%${search}%` } },
        { couponCode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.discountModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']], // ✅ FIX: Usually Sequelize uses 'createdAt' not 'created_at' in order arrays unless specified
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string): Promise<Discount> {
    const discount = await this.discountModel.findOne({ where: { uuid } });
    if (!discount) {
      throw new NotFoundException(`Discount ${uuid} not found`);
    }
    return discount;
  }

  async update(uuid: string, dto: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.findOne(uuid);

    const updateData: any = { ...dto };
    
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    return discount.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const discount = await this.findOne(uuid);
    await discount.destroy();
    return { message: 'Discount deleted successfully' };
  }

  async restore(uuid: string): Promise<Discount> {
    const discount = await this.discountModel.findOne({
      where: { uuid },
      paranoid: false,
    });

    if (!discount) {
      throw new NotFoundException(`Discount ${uuid} not found`);
    }

    // ✅ FIX: Cast to any to access deletedAt if Sequelize types don't expose it
    if (!(discount as any).deletedAt) {
      throw new BadRequestException('Discount is not deleted');
    }

    await discount.restore();
    return this.findOne(uuid);
  }
}