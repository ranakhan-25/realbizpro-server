/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PayableReport } from 'src/database/models/accounts/reports/acc_payeble_report_model';
import { CreatePayableReportDto } from './dto/create-payeble_report.dto';
import { QueryPayableReportDto } from './dto/query-payeble_report.dto';
import { UpdatePayableReportDto } from './dto/update-payeble_report.dto';


@Injectable()
export class PayableReportService {
  constructor(
    @InjectModel(PayableReport)
    private readonly payableModel: typeof PayableReport,
  ) {}

  async create(dto: CreatePayableReportDto, userId?: number, currentUser?: any): Promise<PayableReport> {
    try {
      return await this.payableModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);
    } catch (error) {
      // ✅ আসল এররটি টার্মিনালে দেখুন
      console.error("❌ PayableReport Create Error:", error);
      
      // ✅ এরর মেসেজসহ ক্লায়েন্টকে জানান
      throw new BadRequestException(
        error?.message || 'Failed to create payable entry.'
      );
    }
  }

  async findAll(query: QueryPayableReportDto, currentUser?: any) {
    const { page = '1', limit = '10', search, ...filters } = query;
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
      where.supplierName = { [Op.iLike]: `%${search}%` };
    }

    const { rows, count } = await this.payableModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['supplierName', 'ASC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<PayableReport> {
    const row = await this.payableModel.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Payable entry ${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdatePayableReportDto, userId?: number, currentUser?: any): Promise<PayableReport> {
    const row = await this.findOne(uuid);
    return row.update(dto as any);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const row = await this.findOne(uuid);
    await row.update({ deletedBy: userId ? String(userId) : null } as any);
    await row.destroy();
    return { message: 'Payable entry deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<PayableReport> {
    const row = await this.payableModel.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Payable entry ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException('Entry is not deleted');
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid);
  }
}