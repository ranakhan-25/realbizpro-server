/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HoldProperty, HoldStatus } from '../../../../database/models/sales_management/sm_hold-property.model';
import { CreateHoldPropertyDto } from './dto/create-hold_modal.dto';
import { UpdateHoldPropertyDto } from './dto/update-hold_modal.dto';
import { QueryHoldPropertyDto } from './dto/query-hold_modal.dto';

@Injectable()
export class HoldPropertyService {
  constructor(
    @InjectModel(HoldProperty)
    private readonly holdModel: typeof HoldProperty,
  ) {}

  async create(dto: CreateHoldPropertyDto): Promise<HoldProperty> {
    try {
      return await this.holdModel.create({
        ...dto,
        holdUntil: new Date(dto.holdUntil),
        status: HoldStatus.ACTIVE,
      } as any);
    } catch (error) {
      console.error("❌ HoldProperty Create Error:", error);
      throw new BadRequestException(error?.message || 'Failed to hold property.');
    }
  }

  async findAll(query: QueryHoldPropertyDto) {
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
        { buyerName: { [Op.iLike]: `%${search}%` } },
        { propertyId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.holdModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<HoldProperty> {
    const hold = await this.holdModel.findOne({ where: { uuid } });
    if (!hold) throw new NotFoundException(`Hold Property ${uuid} not found`);
    return hold;
  }

  async update(uuid: string, dto: UpdateHoldPropertyDto): Promise<HoldProperty> {
    const hold = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.holdUntil) {
      updateData.holdUntil = new Date(dto.holdUntil);
    }

    return hold.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const hold = await this.findOne(uuid);
    await hold.destroy();
    return { message: 'Hold Property deleted successfully' };
  }

  async restore(uuid: string): Promise<HoldProperty> {
    const hold = await this.holdModel.findOne({ where: { uuid }, paranoid: false });
    if (!hold) throw new NotFoundException(`Hold Property ${uuid} not found`);
    if (!hold.deletedAt) throw new BadRequestException('Hold Property is not deleted');
    await hold.restore();
    return this.findOne(uuid);
  }
}