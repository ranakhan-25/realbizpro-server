/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateDeductionRuleDto } from './dto/create-deduction-rule.dto';
import { UpdateDeductionRuleDto } from './dto/update-deduction-rule.dto';
import { QueryDeductionRuleDto } from './dto/query-deduction-rule.dto';
import { DeductionRule } from 'src/database/models/hrm/configuration/deduction_rule_model';

@Injectable()
export class DeductionRuleService {
  constructor(
    @InjectModel(DeductionRule)
    private readonly deductionRuleModel: typeof DeductionRule,
  ) {}

  // ---------- CRUD ----------

  async create(
    dto: CreateDeductionRuleDto,
  ): Promise<DeductionRule> {
    const record =
      await this.deductionRuleModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryDeductionRuleDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } =
      await this.deductionRuleModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
  ): Promise<DeductionRule> {
    const record =
      await this.deductionRuleModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `DeductionRule #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateDeductionRuleDto,
  ): Promise<DeductionRule> {
    const record =
      await this.deductionRuleModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `DeductionRule #${uuid} not found`,
      );
    }

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.deductionRuleModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `DeductionRule #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `DeductionRule #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<DeductionRule> {
    const record =
      await this.deductionRuleModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `DeductionRule #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `DeductionRule #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
