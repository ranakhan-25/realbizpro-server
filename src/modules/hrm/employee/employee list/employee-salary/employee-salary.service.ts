/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { EmployeeSalary } from 'src/database/models/hrm/employee/hrm_employeesalary_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateEmployeeSalaryDto } from './dto/create-employee-salary.dto';
import { UpdateEmployeeSalaryDto } from './dto/update-employee-salary.dto';
import { QueryEmployeeSalaryDto } from './dto/query-employee-salary.dto';

@Injectable()
export class EmployeeSalaryService {
  constructor(
    @InjectModel(EmployeeSalary)
    private readonly employeeSalaryModel: typeof EmployeeSalary,
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
    dto: CreateEmployeeSalaryDto,
  ): Promise<EmployeeSalary> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );

    const record =
      await this.employeeSalaryModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryEmployeeSalaryDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
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

    const { rows, count } =
      await this.employeeSalaryModel.findAndCountAll(
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
  ): Promise<EmployeeSalary> {
    const record =
      await this.employeeSalaryModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee salary #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateEmployeeSalaryDto,
  ): Promise<EmployeeSalary> {
    const record =
      await this.employeeSalaryModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee salary #${uuid} not found`,
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
      await this.employeeSalaryModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee salary #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Employee salary #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<EmployeeSalary> {
    const record =
      await this.employeeSalaryModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee salary #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Employee salary #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
