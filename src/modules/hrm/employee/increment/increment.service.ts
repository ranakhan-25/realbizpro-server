/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Increment,
  IncrementStatus,
} from 'src/database/models/hrm/employee/hrm_increment_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateIncrementDto } from './dto/create-increment.dto';
import { UpdateIncrementDto } from './dto/update-increment.dto';
import { QueryIncrementDto } from './dto/query-increment.dto';

@Injectable()
export class IncrementService {
  constructor(
    @InjectModel(Increment)
    private readonly incrementModel: typeof Increment,
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

  // Designation class registered na thakle skip kore (DB FK ta check korbe)
  private async ensureDesignationExists(
    designationId: string,
  ): Promise<void> {
    const assoc: any = (this.incrementModel as any)
      .associations?.designation;
    const target: any = assoc?.target;

    if (!target || !target.sequelize) {
      return;
    }

    const designation = await target.findOne({
      where: { uuid: designationId },
    });

    if (!designation) {
      throw new NotFoundException(
        `Designation #${designationId} not found`,
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateIncrementDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Increment> {
    await this.ensureEmployeeExists(dto.employeeId);
    await this.ensureDesignationExists(dto.designationId);

    const record = await this.incrementModel.create({
      ...dto,
      status: dto.status ?? IncrementStatus.ACTIVE,
      createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
    } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryIncrementDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      designationId,
      status,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = status;
    }

    if (designationId) {
      where.designationId = designationId;
    }

    if (dateFrom && dateTo) {
      where.date = { [Op.between]: [dateFrom, dateTo] };
    } else if (dateFrom) {
      where.date = { [Op.gte]: dateFrom };
    } else if (dateTo) {
      where.date = { [Op.lte]: dateTo };
    }

    const { rows, count } =
      await this.incrementModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      } as any);

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

  async findOne(uuid: string, currentUser?: any): Promise<Increment> {
    const record = await this.incrementModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Increment #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateIncrementDto, userId?: number, currentUser?: any): Promise<Increment> {
    const record = await this.incrementModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Increment #${uuid} not found`,
      );
    }

    if (
      dto.employeeId &&
      dto.employeeId !== record.employeeId
    ) {
      await this.ensureEmployeeExists(dto.employeeId);
    }

    if (
      dto.designationId &&
      dto.designationId !== record.designationId
    ) {
      await this.ensureDesignationExists(dto.designationId);
    }

    await record.update({
      ...dto,
      updatedBy: dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const record = await this.incrementModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Increment #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: IncrementStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await record.destroy();

    return {
      message: `Increment #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Increment> {
    const record = await this.incrementModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!record) {
      throw new NotFoundException(
        `Increment #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Increment #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: IncrementStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
