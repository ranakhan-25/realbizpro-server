import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { SaturationDeduction } from 'src/database/models/hrm/employee/hrm_saturationdeduction_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateSaturationDeductionDto } from './dto/create-saturation-deduction.dto';
import { UpdateSaturationDeductionDto } from './dto/update-saturation-deduction.dto';
import { QuerySaturationDeductionDto } from './dto/query-saturation-deduction.dto';

@Injectable()
export class SaturationDeductionService {
  constructor(
    @InjectModel(SaturationDeduction)
    private readonly saturationDeductionModel: typeof SaturationDeduction,
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
    dto: CreateSaturationDeductionDto,
    userId?: number,
    currentUser?: any,
  ): Promise<SaturationDeduction> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );

    const record =
      await this.saturationDeductionModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(
    query: QuerySaturationDeductionDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      search,
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

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    if (paymentType) {
      where.paymentType = paymentType;
    }

    const { rows, count } =
      await this.saturationDeductionModel.findAndCountAll(
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

  async findOne(uuid: string, currentUser?: any): Promise<SaturationDeduction> {
    const record =
      await this.saturationDeductionModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Saturation deduction #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateSaturationDeductionDto, userId?: number, currentUser?: any): Promise<SaturationDeduction> {
    const record =
      await this.saturationDeductionModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Saturation deduction #${uuid} not found`,
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
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const record =
      await this.saturationDeductionModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Saturation deduction #${uuid} not found`,
      );
    }

    // soft delete
    await record.update({ deletedBy: userId ? String(userId) : null } as any);
    await record.destroy();

    return {
      message: `Saturation deduction #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<SaturationDeduction> {
    const record =
      await this.saturationDeductionModel.findOne(
        {
          where: { uuid } as any,
          paranoid: false,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Saturation deduction #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Saturation deduction #${uuid} is not deleted`,
      );
    }

    await record.restore();
    await record.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);

    return this.findOne(uuid);
  }
}
