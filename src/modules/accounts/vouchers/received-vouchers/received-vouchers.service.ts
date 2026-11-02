import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Voucher } from 'src/database/models/accounts/vouchers/acc_voucher.model';
import { VoucherEntry } from 'src/database/models/accounts/vouchers/acc_voucher-entry.model';
import { CreateVoucherDto } from './dto/create-received-voucher.dto';
import { GetVouchersQueryDto } from './dto/query-received-voucher.dto';
import { UpdateReceivedVoucherDto } from './dto/update-received-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher) private voucherModel: typeof Voucher,
    @InjectModel(VoucherEntry) private voucherEntryModel: typeof VoucherEntry,
    private sequelize: Sequelize,
  ) {}

  async create(dto: CreateVoucherDto): Promise<Voucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.create(
        {
          ...dto,
          accountId: dto.accountId || 'Unassigned',
          paymentMethod: dto.paymentMethod || 'Cash',
          amount: dto.amount ?? 0,
          voucherNo: `R${Date.now()}`,
          voucherType: 'Receipt',
        } as any,
        { transaction },
      );
      await this.voucherEntryModel.bulkCreate(
        dto.entries.map((entry) => ({ ...entry, voucherId: voucher.uuid })),
        { transaction },
      );
      await transaction.commit();
      return this.findOne(voucher.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==============================
  // GET ALL VOUCHERS (Updated with Pagination)
  // ==============================
  async findAll(query: GetVouchersQueryDto) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      projectId, 
      workId,
      startDate, 
      endDate,
      status
    } = query;

    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    // 1. Search by Voucher No
    if (search) {
      whereCondition.voucherNo = { [Op.iLike]: `%${search}%` }; // iLike = Case insensitive (Postgres)
    }

    // 2. Filter by Project / Work
    if (projectId) whereCondition.projectId = projectId;
    if (workId) whereCondition.workId = workId;
    if (status) whereCondition.status = status;

    // 3. Date Range Filter (Screenshot e dewa Select Date)
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereCondition.date = { [Op.gte]: startDate };
    } else if (endDate) {
      whereCondition.date = { [Op.lte]: endDate };
    }

    // 4. Execute Query with Pagination
    const { rows, count } = await this.voucherModel.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      distinct: true, // Important when using include(HasMany) to get correct count
    });
    const vouchers = rows.map((voucher) => voucher.get({ plain: true }));
    const voucherIds = vouchers.map((voucher) => voucher.uuid);
    const entries = voucherIds.length
      ? await this.voucherEntryModel.findAll({
          where: { voucherId: { [Op.in]: voucherIds } },
          order: [['id', 'ASC']],
        })
      : [];
    const entriesByVoucher = entries.reduce<Record<string, VoucherEntry[]>>(
      (grouped, entry) => {
        const plainEntry = entry.get({ plain: true }) as VoucherEntry;
        grouped[entry.voucherId] ??= [];
        grouped[entry.voucherId].push(plainEntry);
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

  async findOne(uuid: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findOne({
      where: { uuid },
    });
    if (!voucher) throw new NotFoundException(`Voucher ${uuid} not found`);
    const entries = await this.voucherEntryModel.findAll({
      where: { voucherId: uuid },
      order: [['id', 'ASC']],
    });
    const result = voucher.get({ plain: true }) as any;
    result.entries = entries.map((entry) => entry.get({ plain: true }));
    return result;
  }

  async update(uuid: string, dto: UpdateReceivedVoucherDto): Promise<Voucher> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.findOne({
        where: { uuid },
        transaction,
      });
      if (!voucher) {
        throw new NotFoundException(`Voucher ${uuid} not found`);
      }

      const { entries, ...voucherData } = dto;
      await voucher.update(voucherData, { transaction });

      if (entries) {
        await this.voucherEntryModel.destroy({
          where: { voucherId: uuid },
          transaction,
        });
        if (entries.length) {
          await this.voucherEntryModel.bulkCreate(
            entries.map((entry) => ({ ...entry, voucherId: uuid })),
            { transaction },
          );
        }
      }

      await transaction.commit();
      return this.findOne(uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction();
    try {
      const voucher = await this.voucherModel.findOne({
        where: { uuid },
        transaction,
      });
      if (!voucher) {
        throw new NotFoundException(`Voucher ${uuid} not found`);
      }

      await this.voucherEntryModel.destroy({
        where: { voucherId: uuid },
        transaction,
      });
      await voucher.destroy({ transaction });
      await transaction.commit();
      return { message: `Voucher ${uuid} deleted successfully` };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}