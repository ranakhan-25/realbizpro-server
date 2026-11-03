/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ChartOfAccount } from 'src/database/models/accounts/configuration/acc_chats_of_accounts_model';
import { ChartOfGroup } from 'src/database/models/accounts/configuration/acc_chats_of_group_model';
import { CreateChartOfAccountDto } from './dto/create-chats_of_account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chats_of_account.dto';
import { QueryChartOfAccountDto } from './dto/query-chats_of_account.dto';

@Injectable()
export class ChartOfAccountService {
  constructor(
    @InjectModel(ChartOfAccount)
    private readonly accountModel: typeof ChartOfAccount,

    @InjectModel(ChartOfGroup)
    private readonly groupModel: typeof ChartOfGroup,
  ) {}

  async create(dto: CreateChartOfAccountDto): Promise<ChartOfAccount> {
    try {
      // ✅ শুধুমাত্র তখনই গ্রুপ চেক করুন যখন chartOfGroupUuid পাঠানো হয়েছে
      if (dto.chartOfGroupUuid && dto.chartOfGroupUuid.trim() !== '') {
        const group = await this.groupModel.findOne({
          where: { uuid: dto.chartOfGroupUuid },
        });

        if (!group) {
          throw new BadRequestException(
            'Invalid chart of group UUID. Please provide an existing chart of group.',
          );
        }
      }

      // ✅ গ্রুপ না থাকলে chartOfGroupUuid বাদ দিয়ে create করুন
      const payload = { ...dto };
      if (!dto.chartOfGroupUuid || dto.chartOfGroupUuid.trim() === '') {
        delete payload.chartOfGroupUuid;
      }

      return await this.accountModel.create(payload as any);
    } catch (error) {
      console.error('ChartOfAccount Create Error:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Account code already exists.');
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new BadRequestException(
          'Invalid foreign key reference. Please check the provided UUID.',
        );
      }

      throw new BadRequestException(
        error?.message || 'Failed to create account.',
      );
    }
  }

  async findAll(query: QueryChartOfAccountDto) {
    const { page = '1', limit = '20', search, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ''
      ) {
        where[key] = filters[key];
      }
    });

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.accountModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string): Promise<ChartOfAccount> {
    const account = await this.accountModel.findOne({
      where: { uuid },
    });

    if (!account) {
      throw new NotFoundException(`Account ${uuid} not found`);
    }

    return account;
  }

  async update(
    uuid: string,
    dto: UpdateChartOfAccountDto,
  ): Promise<ChartOfAccount> {
    const account = await this.findOne(uuid);

    // ✅ শুধুমাত্র তখনই গ্রুপ চেক করুন যখন chartOfGroupUuid পাঠানো হয়েছে
    if (dto.chartOfGroupUuid && dto.chartOfGroupUuid.trim() !== '') {
      const group = await this.groupModel.findOne({
        where: { uuid: dto.chartOfGroupUuid },
      });

      if (!group) {
        throw new BadRequestException('Invalid chart of group UUID.');
      }
    }

    const updateData: any = { ...dto };
    if (!dto.chartOfGroupUuid || dto.chartOfGroupUuid.trim() === '') {
      delete updateData.chartOfGroupUuid;
    }

    return account.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const account = await this.findOne(uuid);

    await account.destroy();

    return {
      message: 'Account deleted successfully',
    };
  }

  async restore(uuid: string): Promise<ChartOfAccount> {
    const account = await this.accountModel.findOne({
      where: { uuid },
      paranoid: false,
    });

    if (!account) {
      throw new NotFoundException(`Account ${uuid} not found`);
    }

    if (!account.deletedAt) {
      throw new BadRequestException('Account is not deleted');
    }

    await account.restore();

    return this.findOne(uuid);
  }
}