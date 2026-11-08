import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

import { PaymentVoucher } from 'src/database/models/accounts/vouchers/acc_payment-voucher.model';
import { PaymentVoucherEntry } from 'src/database/models/accounts/vouchers/acc_payment-voucher-entry.model';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { GetPaymentVouchersQueryDto } from './dto/query-payment-voucher.dto';

@Injectable()
export class PaymentVouchersService {
  constructor(
    @InjectModel(PaymentVoucher) private paymentVoucherModel: typeof PaymentVoucher,
    @InjectModel(PaymentVoucherEntry) private paymentVoucherEntryModel: typeof PaymentVoucherEntry,
    private sequelize: Sequelize,
  ) {}

  async create(dto: CreatePaymentVoucherDto) {
    const t = await this.sequelize.transaction();

    try {
      // 1. Auto Generate Voucher No (P00005)
      const voucherCount = await this.paymentVoucherModel.count({ transaction: t });
      let nextId = voucherCount + 1;
      let voucherNo = `P${String(nextId).padStart(5, '0')}`;
      while (await this.paymentVoucherModel.findOne({
        where: { voucherNo },
        attributes: ['uuid'],
        transaction: t,
      })) {
        nextId += 1;
        voucherNo = `P${String(nextId).padStart(5, '0')}`;
      }

      // 2. Save Master Data
      const voucher = await this.paymentVoucherModel.create(
        {
          ...dto,
          voucherNo,
          status: 'Pending',
        } as any,
        { transaction: t },
      );

      // 3. Save Detail Data
      if (dto.entries && dto.entries.length > 0) {
        const entriesData = dto.entries.map((entry) => ({
          ...entry,
          paymentVoucherId: voucher.uuid,
        }));

        await this.paymentVoucherEntryModel.bulkCreate(entriesData, {
          transaction: t,
        });
      }

      await t.commit();
      return { 
        success: true, 
        message: 'Payment Voucher created successfully', 
        data: voucher 
      };

    } catch (error) {
      await t.rollback();
      throw new BadRequestException(error.message || 'Failed to create Payment Voucher');
    }
  }

  async findAll(query: GetPaymentVouchersQueryDto) {
    const { 
      page = 1, limit = 10, search, projectId, workId, 
      siteId, taskId, status, startDate, endDate 
    } = query;

    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    if (search) {
      whereCondition.voucherNo = { [Op.iLike]: `%${search}%` };
    }
    if (projectId) whereCondition.projectId = projectId;
    if ((query as any)?.orgId) whereCondition.orgId = (query as any).orgId;
    if (workId) whereCondition.workId = workId;
    if (siteId) whereCondition.siteId = siteId;
    if (taskId) whereCondition.taskId = taskId;
    if (status) whereCondition.status = status;

    if (startDate && endDate) {
      whereCondition.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereCondition.date = { [Op.gte]: startDate };
    } else if (endDate) {
      whereCondition.date = { [Op.lte]: endDate };
    }

    const { rows, count } = await this.paymentVoucherModel.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      distinct: true,
    });
    const vouchers = rows.map((voucher) => voucher.get({ plain: true }));
    const voucherIds = vouchers.map((voucher) => voucher.uuid);
    const entries = voucherIds.length
      ? await this.paymentVoucherEntryModel.findAll({
          where: { paymentVoucherId: { [Op.in]: voucherIds } },
          order: [['id', 'ASC']],
        })
      : [];
    const entriesByVoucher = entries.reduce<Record<string, PaymentVoucherEntry[]>>(
      (grouped, entry) => {
        const plainEntry = entry.get({ plain: true }) as PaymentVoucherEntry;
        grouped[entry.paymentVoucherId] ??= [];
        grouped[entry.paymentVoucherId].push(plainEntry);
        return grouped;
      },
      {},
    );
    vouchers.forEach((voucher: any) => {
      voucher.entries = entriesByVoucher[voucher.uuid] ?? [];
    });

    return {
      success: true,
      data: vouchers,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      }
    };
  }

  async findOne(uuid: string) {
    const voucher = await this.paymentVoucherModel.findOne({
      where: { uuid },
    });

    if (!voucher) throw new NotFoundException('Payment Voucher not found');
    const entries = await this.paymentVoucherEntryModel.findAll({
      where: { paymentVoucherId: uuid },
      order: [['id', 'ASC']],
    });
    const result = voucher.get({ plain: true }) as any;
    result.entries = entries.map((entry) => entry.get({ plain: true }));
    return result;
  }

  async remove(uuid: string) {
    const t = await this.sequelize.transaction();
    try {
      const voucher = await this.paymentVoucherModel.findOne({
        where: { uuid },
        transaction: t,
      });
      if (!voucher) throw new NotFoundException('Payment Voucher not found');

      await this.paymentVoucherEntryModel.destroy({
        where: { paymentVoucherId: uuid },
        transaction: t,
      });
      await voucher.destroy({ transaction: t });
      
      await t.commit();
      return { success: true, message: 'Payment Voucher deleted' };
    } catch (error) {
      await t.rollback();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}