/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateSalaryGradeItemDto } from './dto/create-salary-grade-item.dto';

import { UpdateSalaryGradeItemDto } from './dto/update-salary-grade-item.dto';

import { QuerySalaryGradeItemDto } from './dto/query-salary-grade-item.dto';
import { SalaryGradeItem } from 'src/database/models/hrm/configuration/hrm_salary_grade_item_model';

@Injectable()
export class SalaryGradeItemService {
  constructor(
    @InjectModel(SalaryGradeItem)
    private readonly salaryGradeItemModel: typeof SalaryGradeItem,
  ) {}

  // ---------- CREATE ----------

  async create(
    dto: CreateSalaryGradeItemDto,
  ): Promise<SalaryGradeItem> {
    const { addedById, ...data } = dto;

    const record =
      await this.salaryGradeItemModel.create({
        ...data,
        createdBy: addedById ?? null,
      });

    return this.findOne(record.uuid);
  }

  // ---------- FIND ALL ----------

  async findAll(query: QuerySalaryGradeItemDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      type,
      setupId,
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

    // Filter by allowance/deduction type
    if (type) {
      where.type = type;
    }

    // Filter by allowance/deduction setup
    if (setupId) {
      where.setupId = setupId;
    }

    // Search by name
    if (search?.trim()) {
      where.name = {
        [Op.iLike]: `%${search.trim()}%`,
      };
    }

    const { rows, count } =
      await this.salaryGradeItemModel.findAndCountAll(
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

  // ---------- FIND ONE ----------

  async findOne(
    uuid: string,
  ): Promise<SalaryGradeItem> {
    const record =
      await this.salaryGradeItemModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `SalaryGradeItem #${uuid} not found`,
      );
    }

    return record;
  }

  // ---------- UPDATE ----------

  async update(
    uuid: string,
    dto: UpdateSalaryGradeItemDto,
  ): Promise<SalaryGradeItem> {
    const record =
      await this.salaryGradeItemModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `SalaryGradeItem #${uuid} not found`,
      );
    }

    const { addedById, ...updateData } = dto;

    await record.update({
      ...updateData,
      updatedBy:
        addedById ?? record.updatedBy ?? null,
    });

    return this.findOne(uuid);
  }

  // ---------- SOFT DELETE ----------

  async remove(
    uuid: string,
    deletedById?: string,
  ): Promise<{ message: string }> {
    const record =
      await this.salaryGradeItemModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `SalaryGradeItem #${uuid} not found`,
      );
    }

    // Save the user ID before soft deleting
    if (deletedById) {
      await record.update({
        deletedBy: deletedById,
      });
    }

    // Requires paranoid: true in the model
    await record.destroy();

    return {
      message: `SalaryGradeItem #${uuid} deleted successfully`,
    };
  }

  // ---------- RESTORE ----------

  async restore(
    uuid: string,
  ): Promise<SalaryGradeItem> {
    const record =
      await this.salaryGradeItemModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `SalaryGradeItem #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `SalaryGradeItem #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
