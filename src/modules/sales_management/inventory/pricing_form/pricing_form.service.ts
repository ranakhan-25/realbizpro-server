/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PropertyPricing } from '../../../../database/models/sales_management/sm_pricing_form_model';
import { CreatePropertyPricingDto } from './dto/create-pricing_form.dto';
import { UpdatePropertyPricingDto } from './dto/update-pricing_form.dto';
import { QueryPropertyPricingDto } from './dto/query-pricing_form.dto';

@Injectable()
export class PropertyPricingService {
  constructor(
    @InjectModel(PropertyPricing)
    private readonly pricingModel: typeof PropertyPricing,
  ) {}

  async create(dto: CreatePropertyPricingDto): Promise<PropertyPricing> {
    try {
      return await this.pricingModel.create({
        ...dto,
        ...(dto.effectiveDate ? { effectiveDate: new Date(dto.effectiveDate) } : {}),
      } as any);
    } catch (error) {
      console.error("❌ PropertyPricing Create Error:", error);
      throw new BadRequestException(error?.message || 'Failed to create pricing.');
    }
  }

  async findAll(query: QueryPropertyPricingDto) {
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
        { propertyName: { [Op.iLike]: `%${search}%` } },
        { propertyId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.pricingModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<PropertyPricing> {
    const pricing = await this.pricingModel.findOne({ where: { uuid } });
    if (!pricing) throw new NotFoundException(`Property Pricing ${uuid} not found`);
    return pricing;
  }

  async update(uuid: string, dto: UpdatePropertyPricingDto): Promise<PropertyPricing> {
    const pricing = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.effectiveDate) {
      updateData.effectiveDate = new Date(dto.effectiveDate);
    }

    return pricing.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const pricing = await this.findOne(uuid);
    await pricing.destroy();
    return { message: 'Property Pricing deleted successfully' };
  }

  async restore(uuid: string): Promise<PropertyPricing> {
    const pricing = await this.pricingModel.findOne({ where: { uuid }, paranoid: false });
    if (!pricing) throw new NotFoundException(`Property Pricing ${uuid} not found`);
    if (!pricing.deletedAt) throw new BadRequestException('Property Pricing is not deleted');
    await pricing.restore();
    return this.findOne(uuid);
  }
}