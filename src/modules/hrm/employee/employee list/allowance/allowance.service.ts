/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Allowance } from 'src/database/models/hrm/employee/hrm_allowance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { AllowanceType } from 'src/database/models/hrm/employee/hrm_payment_enum';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { QueryAllowanceDto } from './dto/query-allowance.dto';

@Injectable()
export class AllowanceService {
  constructor(
    @InjectModel(Allowance)
    private readonly allowanceModel: typeof Allowance,
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

  private validatePercentage(
    type: AllowanceType,
    percentage?: number | null,
  ): void {
    if (
      type === AllowanceType.PERCENTAGE &&
      (percentage === undefined ||
        percentage === null)
    ) {
      throw new BadRequestException(
        'Percentage is required when allowance type is percentage',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateAllowanceDto,
  ): Promise<Allowance> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );
    this.validatePercentage(
      dto.type,
      dto.percentage,
    );

    const record =
      await this.allowanceModel.create({
        ...dto,
        createdBy: dto.addedById,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryAllowanceDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      search,
      type,
      paymentType,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (search) {
      where.purpose = {
        [Op.like]: `%${search}%`,
      };
    }

    if (type) {
      where.type = type;
    }

    if (paymentType) {
      where.paymentType = paymentType;
    }

    const { rows, count } =
      await this.allowanceModel.findAndCountAll({
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
  ): Promise<Allowance> {
    const record =
      await this.allowanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Allowance #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateAllowanceDto,
  ): Promise<Allowance> {
    const record =
      await this.allowanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Allowance #${uuid} not found`,
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

    this.validatePercentage(
      dto.type ?? record.type,
      dto.percentage !== undefined
        ? dto.percentage
        : record.percentage,
    );

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
      await this.allowanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Allowance #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Allowance #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<Allowance> {
    const record =
      await this.allowanceModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Allowance #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Allowance #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
