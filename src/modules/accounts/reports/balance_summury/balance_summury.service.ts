/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BalanceSheet } from 'src/database/models/accounts/reports/acc_balance-summury_list_model';
import { CreateBalanceSheetDto } from './dto/create-balance_summury.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance_summury.dto';
import { QueryBalanceSheetDto } from './dto/query-balance_summury.dto';

@Injectable()
export class BalanceSheetService {
  constructor(
    @InjectModel(BalanceSheet)
    private readonly balanceSheetModel: typeof BalanceSheet,
  ) {}

  async create(dto: CreateBalanceSheetDto, userId?: number, currentUser?: any): Promise<BalanceSheet> {
    try {
      return await this.balanceSheetModel.create({
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        ...dto,
        asOfDate: new Date(dto.asOfDate),
      } as any);
    } catch (error) {
      throw new BadRequestException('Failed to create balance sheet entry.');
    }
  }

  async findAll(query: QueryBalanceSheetDto, currentUser?: any) {
    const { page = '1', limit = '100', search, asOfDate, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) where.projectId = effectiveProjectId;
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (asOfDate) {
      where.asOfDate = new Date(asOfDate);
    }

    if (search) {
      where[Op.or] = [
        { particulars: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.balanceSheetModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['type', 'ASC'], ['indent', 'ASC'], ['particulars', 'ASC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<BalanceSheet> {
    const row = await this.balanceSheetModel.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Balance sheet entry ${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdateBalanceSheetDto, userId?: number, currentUser?: any): Promise<BalanceSheet> {
    const row = await this.findOne(uuid);
    const updateData: any = { ...dto };
    if (dto.asOfDate) updateData.asOfDate = new Date(dto.asOfDate);
    return row.update({
      ...updateData,
      updatedBy: userId ? String(userId) : row.updatedBy ?? null,
      ...((dto as any).orgId !== undefined ? { orgId: (dto as any).orgId } : {}),
      ...((dto as any).projectId !== undefined ? { projectId: (dto as any).projectId } : {}),
    });
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const row = await this.findOne(uuid);
    await row.update({ deletedBy: userId ? String(userId) : null } as any);
    await row.destroy();
    return { message: 'Balance sheet entry deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<BalanceSheet> {
    const row = await this.balanceSheetModel.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Balance sheet entry ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException('Entry is not deleted');
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid);
  }
}