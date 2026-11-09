/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BankReconciliation, ReconciliationStatus } from '../../../../database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation_statement.dto';
import { UpdateBankReconciliationDto } from './dto/update-bank-reconciliation_statement.dto';
import { QueryBankReconciliationDto } from './dto/query-bank-reconciliation_statement.dto';

@Injectable()
export class BankReconciliationService {
  constructor(
    @InjectModel(BankReconciliation)
    private readonly reconciliationModel: typeof BankReconciliation,
  ) {}

  async create(dto: CreateBankReconciliationDto, userId?: number, currentUser?: any): Promise<BankReconciliation> {
    try {
      return await this.reconciliationModel.create({
        ...dto,
        date: new Date(dto.date),
        ...(dto.chequeDate ? { chequeDate: new Date(dto.chequeDate) } : {}),
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);
    } catch (error) {
      console.error("❌ BankReconciliation Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Voucher number already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create reconciliation.');
    }
  }

  async findAll(query: QueryBankReconciliationDto, currentUser?: any) {
    const { page = '1', limit = '10', search, fromDate, toDate, ...filters } = query;
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

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date[Op.gte] = new Date(fromDate);
      if (toDate) where.date[Op.lte] = new Date(toDate);
    }

    if (search) {
      where[Op.or] = [
        { voucherNo: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { bank: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.reconciliationModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['date', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<BankReconciliation> {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const reconciliation = await this.reconciliationModel.findOne({ where });
    if (!reconciliation) throw new NotFoundException(`Reconciliation ${uuid} not found`);
    return reconciliation;
  }

  async update(uuid: string, dto: UpdateBankReconciliationDto, userId?: number, currentUser?: any): Promise<BankReconciliation> {
    const reconciliation = await this.findOne(uuid, currentUser);
    const updateData: any = {
      ...dto,
      updatedBy: userId ? String(userId) : reconciliation.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
      ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
    };
    if (dto.date) updateData.date = new Date(dto.date);
    if (dto.chequeDate) updateData.chequeDate = new Date(dto.chequeDate);
    return reconciliation.update(updateData);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const reconciliation = await this.findOne(uuid, currentUser);
    await reconciliation.update({ deletedBy: userId ? String(userId) : null } as any);
    await reconciliation.destroy();
    return { message: 'Reconciliation deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<BankReconciliation> {
    const reconciliation = await this.reconciliationModel.findOne({ where: { uuid }, paranoid: false });
    if (!reconciliation) throw new NotFoundException(`Reconciliation ${uuid} not found`);
    if (!reconciliation.deletedAt) throw new BadRequestException('Reconciliation is not deleted');
    await reconciliation.restore();
    await reconciliation.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid, currentUser);
  }
}
