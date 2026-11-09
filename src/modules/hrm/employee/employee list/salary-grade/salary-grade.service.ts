import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  SalaryGrade,
  SalaryGradeStatus,
} from 'src/database/models/hrm/employee/hrm_salary_grade_model';
import { CreateSalaryGradeDto } from './dto/create-salary-grade.dto';
import { UpdateSalaryGradeDto } from './dto/update-salary-grade.dto';
import { QuerySalaryGradeDto } from './dto/query-salary-grade.dto';

@Injectable()
export class SalaryGradeService {
  constructor(
    @InjectModel(SalaryGrade)
    private readonly salaryGradeModel: typeof SalaryGrade,
  ) {}

  async create(
    dto: CreateSalaryGradeDto,
    userId?: number,
    currentUser?: any,
  ): Promise<SalaryGrade> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing =
      await this.salaryGradeModel.findOne({
        where: { name: dto.name } as any,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Salary grade "${dto.name}" already exists in deleted records, please restore it`
          : `Salary grade "${dto.name}" already exists`,
      );
    }

    const record =
      await this.salaryGradeModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        status:
          dto.status ?? SalaryGradeStatus.ACTIVE,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QuerySalaryGradeDto, currentUser?: any) {
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
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.salaryGradeModel.findAndCountAll(
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

  async findOne(uuid: string, currentUser?: any): Promise<SalaryGrade> {
    const record =
      await this.salaryGradeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Salary grade #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateSalaryGradeDto, userId?: number, currentUser?: any): Promise<SalaryGrade> {
    const record =
      await this.salaryGradeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Salary grade #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== record.name) {
      const exists =
        await this.salaryGradeModel.findOne({
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        });

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Salary grade "${dto.name}" already exists in deleted records`
            : `Salary grade "${dto.name}" already exists`,
        );
      }
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
      await this.salaryGradeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Salary grade #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: SalaryGradeStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await record.destroy();

    return {
      message: `Salary grade #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<SalaryGrade> {
    const record =
      await this.salaryGradeModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Salary grade #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Salary grade #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: SalaryGradeStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
