/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ItemEntry } from 'src/database/models/accounts/assets/acc_item_entry_model';
import { CreateItemEntryDto } from './dto/create-item_entry.dto';
import { QueryItemEntryDto } from './dto/query-item_entry.dto';
import { UpdateItemEntryDto } from './dto/update-item_entry.dto';


@Injectable()
export class ItemEntryService {
  constructor(
    @InjectModel(ItemEntry)
    private readonly itemModel: typeof ItemEntry,
  ) {}

  async create(dto: CreateItemEntryDto): Promise<ItemEntry> {
    try {
      return await this.itemModel.create({
        ...dto,
        acquisitionDate: new Date(dto.acquisitionDate),
        bookValue: dto.bookValue ?? dto.originalValue,
        depreciableValue: dto.depreciableValue ?? dto.originalValue,
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Item already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryItemEntryDto) {
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
        { itemName: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.itemModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<ItemEntry> {
    const item = await this.itemModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException(`Item ${uuid} not found`);
    return item;
  }

  async update(uuid: string, dto: UpdateItemEntryDto): Promise<ItemEntry> {
    const item = await this.findOne(uuid);
    const updateData: any = { ...dto };
    if (dto.acquisitionDate) updateData.acquisitionDate = new Date(dto.acquisitionDate);
    return item.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const item = await this.findOne(uuid);
    await item.destroy();
    return { message: 'Item deleted successfully' };
  }
}