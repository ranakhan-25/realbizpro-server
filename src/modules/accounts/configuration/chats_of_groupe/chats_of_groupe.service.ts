/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ChartOfGroup } from 'src/database/models/accounts/configuration/acc_chats_of_group_model';
import { CreateChartOfGroupDto } from './dto/create-chats_of_groupe.dto';
import { UpdateChartOfGroupDto } from './dto/update-chats_of_groupe.dto';
import { QueryChartOfGroupDto } from './dto/query-chats_of_groupe.dto';

@Injectable()
export class ChartOfGroupService {
  constructor(
    @InjectModel(ChartOfGroup)
    private readonly groupModel: typeof ChartOfGroup,
  ) {}

  async create(dto: CreateChartOfGroupDto, userId?: number, currentUser?: any): Promise<ChartOfGroup> {
    try {
      return await this.groupModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);
    } catch (error) {
      console.error("❌ ChartOfGroup Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Group code already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create group.');
    }
  }

  async findAll(query: QueryChartOfGroupDto, currentUser?: any) {
    const { page = '1', limit = '20', search, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    const effectiveOrgId = currentUser?.orgId ?? (query as any)?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const effectiveProjectId = currentUser?.projectId ?? (query as any)?.projectId;
    if (effectiveProjectId) where.projectId = effectiveProjectId;
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // ✅ include বাদ দেওয়া হয়েছে
    const { rows, count } = await this.groupModel.findAndCountAll({
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

  async findOne(uuid: string, currentUser?: any): Promise<ChartOfGroup> {
    // ✅ include বাদ দেওয়া হয়েছে
    const group = await this.groupModel.findOne({ where: { uuid } });
    if (!group) throw new NotFoundException(`Group ${uuid} not found`);
    return group;
  }

  async update(uuid: string, dto: UpdateChartOfGroupDto, userId?: number, currentUser?: any): Promise<ChartOfGroup> {
    const group = await this.findOne(uuid);
    return group.update({
      ...dto,
      updatedBy: userId ? String(userId) : group.updatedBy ?? null,
      ...((dto as any).orgId !== undefined ? { orgId: (dto as any).orgId } : {}),
      ...((dto as any).projectId !== undefined ? { projectId: (dto as any).projectId } : {}),
    } as any);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const group = await this.findOne(uuid);
    await group.update({ deletedBy: userId ? String(userId) : null } as any);
    await group.destroy();
    return { message: 'Group deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<ChartOfGroup> {
    const group = await this.groupModel.findOne({ where: { uuid }, paranoid: false });
    if (!group) throw new NotFoundException(`Group ${uuid} not found`);
    if (!group.deletedAt) throw new BadRequestException('Group is not deleted');
    await group.restore();
    await group.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid);
  }
}