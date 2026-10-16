/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Loan } from 'src/database/models/hrm/employee/hrm_loan_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { QueryLoanDto } from './dto/query-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan)
    private readonly loanModel: typeof Loan,
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

  private validateDates(
    startDate: string,
    endDate?: string | null,
  ): void {
    if (
      endDate &&
      new Date(endDate).getTime() <
        new Date(startDate).getTime()
    ) {
      throw new BadRequestException(
        'End date cannot be before start date',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateLoanDto,
  ): Promise<Loan> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );
    this.validateDates(
      dto.startDate,
      dto.endDate,
    );

    const record = await this.loanModel.create({
      ...dto,
      createdBy: dto.addedById,
    });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryLoanDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      search,
      startDateFrom,
      startDateTo,
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
      where.type = { [Op.like]: `%${search}%` };
    }

    if (startDateFrom && startDateTo) {
      where.startDate = {
        [Op.between]: [
          startDateFrom,
          startDateTo,
        ],
      };
    } else if (startDateFrom) {
      where.startDate = {
        [Op.gte]: startDateFrom,
      };
    } else if (startDateTo) {
      where.startDate = { [Op.lte]: startDateTo };
    }

    const { rows, count } =
      await this.loanModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<Loan> {
    const record = await this.loanModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Loan #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateLoanDto,
  ): Promise<Loan> {
    const record = await this.loanModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Loan #${uuid} not found`,
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

    this.validateDates(
      dto.startDate ?? record.startDate,
      dto.endDate !== undefined
        ? dto.endDate
        : record.endDate,
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
    const record = await this.loanModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Loan #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Loan #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Loan> {
    const record = await this.loanModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!record) {
      throw new NotFoundException(
        `Loan #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Loan #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
