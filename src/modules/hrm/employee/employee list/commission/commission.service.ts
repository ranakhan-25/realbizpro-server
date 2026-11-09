/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Commission } from 'src/database/models/hrm/employee/hrm_commission_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { QueryCommissionDto } from './dto/query-commission.dto';

@Injectable()
export class CommissionService {
  constructor(
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(EmployeeList)
    private readonly employeeListModel: typeof EmployeeList,
  ) {}

  // ---------- helpers ----------

  private async ensureEmployeeExists(
    employeeId: string,
  ): Promise<void> {
    const employee =
      await this.employeeListModel.findOne({
        where: { uuid: employeeId } as any,
      });

    if (!employee) {
      throw new NotFoundException(
        `Employee #${employeeId} not found`,
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateCommissionDto,
  ): Promise<Commission> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );

    const record =
      await this.commissionModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryCommissionDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      search,
      type,
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

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    if (type) {
      where.type = type;
    }

    const { rows, count } =
      await this.commissionModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

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
  ): Promise<Commission> {
    const record =
      await this.commissionModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Commission #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateCommissionDto,
  ): Promise<Commission> {
    const record =
      await this.commissionModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Commission #${uuid} not found`,
      );
    }

    if (
      dto.employeeId &&
      dto.employeeId !== record.employeeId
    ) {
      await this.ensureEmployeeExists(
        dto.employeeId,
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
      await this.commissionModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Commission #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Commission #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<Commission> {
    const record =
      await this.commissionModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Commission #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Commission #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
