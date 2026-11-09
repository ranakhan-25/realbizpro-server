/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Department,
  DepartmentStatus,
} from 'src/database/models/hrm/employee/hrm_department_model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async create(
    dto: CreateDepartmentDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Department> {
    const existing =
      await this.departmentModel.findOne({
        where: {
          name: dto.name,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Department "${dto.name}" already exists`,
      );
    }

    const department =
      await this.departmentModel.create({
        ...dto,
        status:
          dto.status ?? DepartmentStatus.ACTIVE,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      } as any);

    return this.findOne(department.uuid);
  }

  async findAll(query: QueryDepartmentDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      departmentHeadId,
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
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        {
          departmentHeadId: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (departmentHeadId) {
      where.departmentHeadId = departmentHeadId;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.departmentModel.findAndCountAll({
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

  async findOne(
    uuid: string,
    currentUser?: any,
  ): Promise<Department> {
    const department =
      await this.departmentModel.findOne({
        where: { uuid } as any,
      });

    if (!department) {
      throw new NotFoundException(
        `Department #${uuid} not found`,
      );
    }

    return department;
  }

  async update(
    uuid: string,
    dto: UpdateDepartmentDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Department> {
    const department =
      await this.departmentModel.findOne({
        where: { uuid } as any,
      });

    if (!department) {
      throw new NotFoundException(
        `Department #${uuid} not found`,
      );
    }

    if (
      dto.name &&
      dto.name !== department.name
    ) {
      const exists =
        await this.departmentModel.findOne({
          where: {
            name: dto.name,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Department "${dto.name}" already exists`,
        );
      }
    }

    await department.update({
      ...dto,
      updatedBy: userId ? String(userId) : department.updatedBy ?? null,
      ...((dto as any).orgId !== undefined ? { orgId: (dto as any).orgId } : {}),
      ...((dto as any).projectId !== undefined ? { projectId: (dto as any).projectId } : {}),
    } as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
    userId?: number,
    currentUser?: any,
  ): Promise<{ message: string }> {
    const department =
      await this.departmentModel.findOne({
        where: { uuid } as any,
      });

    if (!department) {
      throw new NotFoundException(
        `Department #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await department.update({
      status: DepartmentStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await department.destroy();

    return {
      message: `Department #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
    userId?: number,
    currentUser?: any,
  ): Promise<Department> {
    const department =
      await this.departmentModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!department) {
      throw new NotFoundException(
        `Department #${uuid} not found`,
      );
    }

    if (!department.deletedAt) {
      throw new BadRequestException(
        `Department #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await department.restore();
    await department.update({
      status: DepartmentStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
