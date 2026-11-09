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

  async create(dto: CreateItemEntryDto, userId?: number, currentUser?: any): Promise<ItemEntry> {
    try {
      return await this.itemModel.create({
        ...dto,
        acquisitionDate: new Date(dto.acquisitionDate),
        bookValue: dto.bookValue ?? dto.originalValue,
        depreciableValue: dto.depreciableValue ?? dto.originalValue,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Item already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryItemEntryDto, currentUser?: any) {
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

    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }

    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

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

  async findOne(uuid: string, currentUser?: any): Promise<ItemEntry> {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const item = await this.itemModel.findOne({
      where,
      paranoid: false,
    });
    if (!item) throw new NotFoundException(`Item ${uuid} not found`);
    return item;
  }

  async update(uuid: string, dto: UpdateItemEntryDto, userId?: number, currentUser?: any): Promise<ItemEntry> {
    const item = await this.findOne(uuid, currentUser);
    const updateData: any = {
      ...dto,
      updatedBy: userId ? String(userId) : item.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
      ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
    };
    if (dto.acquisitionDate) updateData.acquisitionDate = new Date(dto.acquisitionDate);
    const originalValue =
      dto.originalValue !== undefined ? Number(dto.originalValue) : Number(item.originalValue);
    if (dto.originalValue !== undefined || dto.bookValue !== undefined) {
      updateData.bookValue = dto.bookValue ?? originalValue;
    }
    if (dto.originalValue !== undefined || dto.depreciableValue !== undefined) {
      updateData.depreciableValue = dto.depreciableValue ?? originalValue;
    }
    return item.update(updateData);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const item = await this.findOne(uuid, currentUser);
    await item.update({ deletedBy: userId ? String(userId) : null } as any);
    await item.destroy();
    return { message: 'Item deleted successfully' };
  }
}
