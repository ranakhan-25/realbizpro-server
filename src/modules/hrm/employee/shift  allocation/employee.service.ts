/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  Employee,
  EmployeeStatus,
} from 'src/database/models/hrm/employee/hrm_employee_model';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee)
    private readonly model: typeof Employee,
  ) {}

  // Create employee
  async create(
    dto: CreateEmployeeDto,
  ): Promise<Employee> {
    const duplicate = await this.model.findOne({
      where: {
        employeeCode: dto.employeeCode,
      },
      paranoid: false,
    });

    if (duplicate) {
      throw new BadRequestException(
        `Employee code '${dto.employeeCode}' already exists`,
      );
    }

    const item = await this.model.create({
      ...dto,
      status: dto.status ?? EmployeeStatus.ACTIVE,
    });

    return this.findOne(item.uuid);
  }

  // Get all employees with search, filters and pagination
  async findAll(query: QueryEmployeeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const offset =
      query.skip ?? (page - 1) * limit;

    const where: any = {};

    // Search by employee name or employee code
    if (query.search?.trim()) {
      const searchTerm: string =
        query.search.trim();

      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          employeeCode: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // Filter by employee status
    if (query.status) {
      where.status = query.status;
    }

    const { rows, count } =
      await this.model.findAndCountAll({
        where,
        limit,
        offset,
        paranoid: !(query.withDeleted ?? false),
        order: [
          [
            query.sortBy ?? 'createdAt',
            query.sortOrder ?? 'DESC',
          ],
        ],
      });

    const currentPage =
      query.skip !== undefined
        ? Math.floor(offset / limit) + 1
        : page;

    const totalPages =
      Math.ceil(count / limit) || 1;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : null,
        previousPage:
          currentPage > 1
            ? currentPage - 1
            : null,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  // Get employee by UUID
  async findOne(
    uuid: string,
    withDeleted = false,
  ): Promise<Employee> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: !withDeleted,
    });

    if (!item) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    return item;
  }

  // Update employee
  async update(
    uuid: string,
    dto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const item = await this.findOne(uuid);

    if (
      dto.employeeCode &&
      dto.employeeCode !== item.employeeCode
    ) {
      const duplicate = await this.model.findOne({
        where: {
          employeeCode: dto.employeeCode,
        },
        paranoid: false,
      });

      if (duplicate) {
        throw new BadRequestException(
          `Employee code '${dto.employeeCode}' already exists`,
        );
      }
    }

    await item.update(dto);

    return this.findOne(uuid);
  }

  // Soft delete employee
  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const item = await this.findOne(uuid);

    await item.destroy();

    return {
      message: `Employee #${uuid} deleted successfully`,
    };
  }

  // Restore deleted employee
  async restore(uuid: string): Promise<Employee> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!item) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    if (!(item as any).deletedAt) {
      throw new BadRequestException(
        `Employee #${uuid} is not deleted`,
      );
    }

    await item.restore();

    return this.findOne(uuid);
  }
}
