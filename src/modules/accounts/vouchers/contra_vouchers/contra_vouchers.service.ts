/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ContraVoucher } from 'src/database/models/accounts/vouchers/acc_contra-voucher.model';
import { CreateContraVoucherDto } from './dto/create-contra_voucher.dto';
import { ContraVoucherItem } from 'src/database/models/accounts/vouchers/acc_contra-voucher-item.model';
import { QueryContraVoucherDto } from './dto/query-contra_voucher.dto';
import { UpdateContraVoucherDto } from './dto/update-contra_voucher.dto';

@Injectable()
export class ContraVoucherService {
  constructor(
    @InjectModel(ContraVoucher)
    private readonly voucherModel: typeof ContraVoucher,
    @InjectModel(ContraVoucherItem)
    private readonly voucherItemModel: typeof ContraVoucherItem,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateContraVoucherDto, userId?: number, currentUser?: any): Promise<ContraVoucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.create({
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        ...dto,
        date: new Date(dto.date),
      } as any, { transaction });

      if (dto.items && dto.items.length > 0) {
        const itemsData = dto.items.map((item: any) => {
          const { chartOfAccountUuid, chartOfAccountId, accountUuid, coaUuid, chqReceipt, debitAmount, creditAmount, drAmount, crAmount, ...data } = item;
          return {
            ...data,
            accountId: data.accountId ?? chartOfAccountUuid ?? chartOfAccountId ?? accountUuid ?? coaUuid,
            chequeReceiptNo: data.chequeReceiptNo ?? chqReceipt,
            debit: data.debit ?? debitAmount ?? drAmount ?? 0,
            credit: data.credit ?? creditAmount ?? crAmount ?? 0,
            contraVoucherUuid: voucher.uuid,
          };
        });
        await this.voucherItemModel.bulkCreate(itemsData as any, { transaction });
      }

      await transaction.commit();
      return this.findOne(voucher.uuid);
    } catch (error) {
      await transaction.rollback();
      console.error("❌ ContraVoucher Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Voucher number already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create voucher.');
    }
  }

  async findAll(query: QueryContraVoucherDto, currentUser?: any) {
    const { page = '1', limit = '10', search, fromDate, toDate, accountId, ...filters } = query;
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

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date[Op.gte] = new Date(fromDate);
      if (toDate) where.date[Op.lte] = new Date(toDate);
    }

    if (search) {
      where[Op.or] = [
        { voucherNo: { [Op.iLike]: `%${search}%` } },
        { project: { [Op.iLike]: `%${search}%` } },
        { addedBy: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.voucherModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['date', 'DESC']],
      distinct: true,
    });
    const voucherUuids = rows.map((voucher) => voucher.uuid);
    const itemWhere: any = {
      contraVoucherUuid: { [Op.in]: voucherUuids },
    };
    if (accountId) itemWhere.accountId = accountId;
    const items = voucherUuids.length
      ? await this.voucherItemModel.findAll({ where: itemWhere })
      : [];
    const itemsByVoucher = new Map<string, ContraVoucherItem[]>();
    items.forEach((item) => {
      const voucherItems = itemsByVoucher.get(item.contraVoucherUuid) || [];
      voucherItems.push(item);
      itemsByVoucher.set(item.contraVoucherUuid, voucherItems);
    });
    const data = rows.map((voucher) => {
      const value: any = voucher.toJSON();
      value.items = itemsByVoucher.get(voucher.uuid) || [];
      return value;
    });

    return {
      data,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<ContraVoucher> {
    const voucher = await this.voucherModel.findOne({
      where: { uuid },
   
    });
    if (!voucher) throw new NotFoundException(`Contra Voucher ${uuid} not found`);
    const items = await this.voucherItemModel.findAll({
      where: { contraVoucherUuid: uuid },
    });
    const value: any = voucher.toJSON();
    value.items = items;
    return value as ContraVoucher;
  }

  async update(uuid: string, dto: UpdateContraVoucherDto, userId?: number, currentUser?: any): Promise<ContraVoucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.findOne({ where: { uuid } });
      if (!voucher) throw new NotFoundException(`Contra Voucher ${uuid} not found`);
      const { items, details: _details, attachmentName: _attachmentName, ...voucherData } = dto as any;
      const updateData: any = {
        ...voucherData,
        updatedBy: userId ? String(userId) : voucher.updatedBy ?? null,
        ...((dto as any).orgId !== undefined ? { orgId: (dto as any).orgId } : {}),
        ...((dto as any).projectId !== undefined ? { projectId: (dto as any).projectId } : {}),
      };
      if (dto.date) updateData.date = new Date(dto.date);
      await voucher.update(updateData, { transaction });

      if (items) {
        await this.voucherItemModel.destroy({
          where: { contraVoucherUuid: uuid },
          transaction,
        });
        if (items.length > 0) {
          await this.voucherItemModel.bulkCreate(
            items.map((item: any) => {
              const { chartOfAccountUuid, chqReceipt, ...normalizedItem } = item;
              return {
                ...normalizedItem,
                accountId: normalizedItem.accountId ?? chartOfAccountUuid,
                chequeReceiptNo: normalizedItem.chequeReceiptNo ?? chqReceipt,
                contraVoucherUuid: uuid,
              };
            }) as any,
            { transaction },
          );
        }
      }

      await transaction.commit();
      return this.findOne(uuid);
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error?.message || 'Failed to update voucher.');
    }
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const voucher = await this.voucherModel.findOne({ where: { uuid } });
    if (!voucher) throw new NotFoundException(`Contra Voucher ${uuid} not found`);
    await voucher.update({ deletedBy: userId ? String(userId) : null } as any);
    await voucher.destroy();
    return { message: 'Contra Voucher deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<ContraVoucher> {
    const voucher = await this.voucherModel.findOne({ where: { uuid }, paranoid: false });
    if (!voucher) throw new NotFoundException(`Contra Voucher ${uuid} not found`);
    if (!voucher.deletedAt) throw new BadRequestException('Voucher is not deleted');
    await voucher.restore();
    await voucher.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid);
  }
}