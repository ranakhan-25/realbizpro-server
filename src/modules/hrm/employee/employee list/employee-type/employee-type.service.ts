import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateEmployeeTypeDto } from './dto/create-employee-type.dto';
import { UpdateEmployeeTypeDto } from './dto/update-employee-type.dto';
import { QueryEmployeeTypeDto } from './dto/query-employee-type.dto';
import {
  EmployeeType,
  EmployeeTypeStatus,
} from 'src/database/models/hrm/employee/hrm_employee_type-model';

@Injectable()
export class EmployeeTypeService {
  constructor(
    @InjectModel(EmployeeType)
    private readonly employeeTypeModel: typeof EmployeeType,
  ) {}

  async create(
    dto: CreateEmployeeTypeDto,
  ): Promise<EmployeeType> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing =
      await this.employeeTypeModel.findOne({
        where: { name: dto.name } as any,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Employee type "${dto.name}" already exists in deleted records, please restore it`
          : `Employee type "${dto.name}" already exists`,
      );
    }

    const record =
      await this.employeeTypeModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
        status:
          dto.status ?? EmployeeTypeStatus.ACTIVE,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryEmployeeTypeDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
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

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.employeeTypeModel.findAndCountAll(
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
  ): Promise<EmployeeType> {
    const record =
      await this.employeeTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee type #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateEmployeeTypeDto,
  ): Promise<EmployeeType> {
    const record =
      await this.employeeTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee type #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== record.name) {
      const exists =
        await this.employeeTypeModel.findOne({
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        });

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Employee type "${dto.name}" already exists in deleted records`
            : `Employee type "${dto.name}" already exists`,
        );
      }
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
      await this.employeeTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee type #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: EmployeeTypeStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `Employee type #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<EmployeeType> {
    const record =
      await this.employeeTypeModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee type #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Employee type #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: EmployeeTypeStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
