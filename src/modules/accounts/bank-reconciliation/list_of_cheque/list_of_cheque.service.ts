/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Cheque } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque.model';
import { ChequeRange } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque-range.model';
import { CreateChequeDto } from './dto/create-list_of_cheque.dto';
import { UpdateListOfChequeDto } from './dto/update-list_of_cheque.dto';

@Injectable()
export class ChequeService {
  constructor(
    @InjectModel(Cheque)
    private readonly chequeModel: typeof Cheque,
    @InjectModel(ChequeRange)
    private readonly chequeRangeModel: typeof ChequeRange,
  ) {}

  async create(dto: CreateChequeDto, userId?: number, currentUser?: any): Promise<Cheque> {
    try {
      return await this.chequeModel.create({
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        ...dto,
        ...(dto.instrumentDate ? { instrumentDate: new Date(dto.instrumentDate) } : {}),
      } as any);
    } catch (error) {
      console.error("❌ Cheque Create Error:", error);
      throw new BadRequestException(error?.message || 'Failed to create cheque.');
    }
  }

  async findAll(query: any, currentUser?: any) {
    const { page = '1', limit = '10', search, cashBank, ...filters } = query;
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

    if (search) {
      where[Op.or] = [
        { instrumentNumber: { [Op.iLike]: `%${search}%` } },
        { favouringName: { [Op.iLike]: `%${search}%` } },
        { chequeStatus: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.chequeModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });
    const rangeUuids = [...new Set(rows.map((cheque) => cheque.chequeRangeUuid).filter(Boolean))];
    const rangeWhere: any = { uuid: { [Op.in]: rangeUuids } };
    if (cashBank) rangeWhere.cashBank = cashBank;
    const ranges = rangeUuids.length
      ? await this.chequeRangeModel.findAll({ where: rangeWhere })
      : [];
    const rangeMap = new Map(ranges.map((range) => [range.uuid, range]));
    const data = rows.map((cheque) => {
      const value: any = cheque.toJSON();
      value.chequeRange = rangeMap.get(cheque.chequeRangeUuid) || null;
      return value;
    });
    if (cashBank) {
      const filteredData = data.filter((cheque) => cheque.chequeRange);
      return {
        data: filteredData,
        meta: { total: filteredData.length, page: pageNum, limit: limitNum, totalPages: Math.ceil(filteredData.length / limitNum) },
      };
    }

    return {
      data,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<Cheque> {
    const cheque = await this.chequeModel.findOne({
      where: { uuid },
      
    });
    if (!cheque) throw new NotFoundException(`Cheque ${uuid} not found`);
    const chequeRange = await this.chequeRangeModel.findOne({
      where: { uuid: cheque.chequeRangeUuid },
    });
    const value: any = cheque.toJSON();
    value.chequeRange = chequeRange;
    return value as Cheque;
  }

  async update(uuid: string, dto: UpdateListOfChequeDto, userId?: number, currentUser?: any): Promise<Cheque> {
    const cheque = await this.chequeModel.findOne({ where: { uuid } });
    if (!cheque) throw new NotFoundException(`Cheque ${uuid} not found`);
    const { instrumentDate, ...updates } = dto;
    await cheque.update({
      ...updates,
      ...(instrumentDate ? { instrumentDate: new Date(instrumentDate) } : {}),
    });
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const cheque = await this.chequeModel.findOne({ where: { uuid } });
    if (!cheque) throw new NotFoundException(`Cheque ${uuid} not found`);
    await cheque.update({ deletedBy: userId ? String(userId) : null } as any);
    await cheque.destroy();
    return { message: 'Cheque deleted successfully.' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Cheque> {
    const cheque = await this.chequeModel.findOne({
      where: { uuid },
      paranoid: false,
    });
    if (!cheque) throw new NotFoundException(`Cheque ${uuid} not found`);
    await cheque.restore();
    await cheque.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return cheque;
  }
}