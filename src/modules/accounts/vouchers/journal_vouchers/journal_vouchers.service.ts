/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { JournalVoucher } from 'src/database/models/accounts/vouchers/acc_journal-voucher.model';
import { CreateJournalVoucherDto } from './dto/create-journal_voucher.dto';
import { JournalVoucherItem } from 'src/database/models/accounts/vouchers/acc_journal-voucher-item.model';
import { QueryJournalVoucherDto } from './dto/query-contra_voucher.dto';
import { UpdateJournalVoucherDto } from './dto/update-journal_voucher.dto';

@Injectable()
export class JournalVoucherService {
  constructor(
    @InjectModel(JournalVoucher)
    private readonly voucherModel: typeof JournalVoucher,
    @InjectModel(JournalVoucherItem)
    private readonly voucherItemModel: typeof JournalVoucherItem,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateJournalVoucherDto): Promise<JournalVoucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const { bank_name: _bankName, ...voucherData } = dto as any;
      const voucher = await this.voucherModel.create({
        ...voucherData,
        date: new Date(voucherData.date),
      } as any, { transaction });

      if (dto.items && dto.items.length > 0) {
        const itemsData = this.normalizeItems(dto.items).map((item) => ({
          ...item,
          journalVoucherUuid: voucher.uuid,
        }));
        await this.voucherItemModel.bulkCreate(itemsData as any, { transaction });
      }

      await transaction.commit();
      return this.findOne(voucher.uuid);
    } catch (error) {
      await transaction.rollback();
      console.error("❌ JournalVoucher Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Voucher number already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create voucher.');
    }
  }

  async findAll(query: QueryJournalVoucherDto) {
    const { page = '1', limit = '10', search, fromDate, toDate, accountId, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
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
      journalVoucherUuid: { [Op.in]: voucherUuids },
    };
    if (accountId) itemWhere.accountId = accountId;
    const items = voucherUuids.length
      ? await this.voucherItemModel.findAll({ where: itemWhere })
      : [];
    const itemsByVoucher = new Map<string, JournalVoucherItem[]>();
    items.forEach((item) => {
      const voucherItems = itemsByVoucher.get(item.journalVoucherUuid) || [];
      voucherItems.push(item);
      itemsByVoucher.set(item.journalVoucherUuid, voucherItems);
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

  async findOne(uuid: string): Promise<JournalVoucher> {
    const voucher = await this.voucherModel.findOne({
      where: { uuid },
    });
    if (!voucher) throw new NotFoundException(`Journal Voucher ${uuid} not found`);
    const items = await this.voucherItemModel.findAll({
      where: { journalVoucherUuid: uuid },
    });
    const value: any = voucher.toJSON();
    value.items = items;
    return value as JournalVoucher;
  }

  async update(uuid: string, dto: UpdateJournalVoucherDto): Promise<JournalVoucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.findOne({ where: { uuid }, transaction });
      if (!voucher) throw new NotFoundException(`Journal Voucher ${uuid} not found`);
      const { items, bank_name: _bankName, ...voucherData } = dto as any;
      const updateData: any = { ...voucherData };
      if (dto.date) updateData.date = new Date(dto.date);
      await voucher.update(updateData, { transaction });

      if (items) {
        await this.voucherItemModel.destroy({
          where: { journalVoucherUuid: uuid },
          transaction,
        });
        if (items.length > 0) {
          await this.voucherItemModel.bulkCreate(
            this.normalizeItems(items).map((item) => ({
              ...item,
              journalVoucherUuid: uuid,
            })) as any,
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

  async remove(uuid: string): Promise<{ message: string }> {
    const voucher = await this.voucherModel.findOne({ where: { uuid } });
    if (!voucher) throw new NotFoundException(`Journal Voucher ${uuid} not found`);
    await voucher.destroy();
    return { message: 'Journal Voucher deleted successfully' };
  }

  async restore(uuid: string): Promise<JournalVoucher> {
    const voucher = await this.voucherModel.findOne({ where: { uuid }, paranoid: false });
    if (!voucher) throw new NotFoundException(`Journal Voucher ${uuid} not found`);
    if (!voucher.deletedAt) throw new BadRequestException('Voucher is not deleted');
    await voucher.restore();
    return this.findOne(uuid);
  }

  private normalizeItems(items: any[]) {
    return items.map(({ chqReceipt, chartOfAccountUuid, bank_name, ...item }) => ({
      ...item,
      accountId: item.accountId ?? chartOfAccountUuid,
      chequeReceiptNo: item.chequeReceiptNo ?? chqReceipt,
    }));
  }
}