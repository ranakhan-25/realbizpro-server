import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Designation,
  DesignationStatus,
} from 'src/database/models/hrm/employee/hrm_designation_model';
import { Department } from 'src/database/models/hrm/employee/hrm_department_model';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectModel(Designation)
    private readonly designationModel: typeof Designation,
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async create(
    dto: CreateDesignationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Designation> {
    // relation: (departmentId + name) একসাথে unique
    const existing =
      await this.designationModel.findOne({
        where: {
          name: dto.name,
          departmentId: dto.departmentId,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Designation "${dto.name}" already exists in this department`,
      );
    }

    const designation =
      await this.designationModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        status:
          dto.status ?? DesignationStatus.ACTIVE,
      } as any);

    return this.findOne(designation.uuid);
  }

  async findAll(query: QueryDesignationDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      departmentId,
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
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.designationModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
          // relation: injected model use korte hobe
          // (import kora class repositoryMode e initialized na)
          include: [
            {
              model: this.departmentModel,
              as: 'department',
              required: false,
            },
          ],
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

  async getDropdown(currentUser?: any): Promise<any[]> {
    return this.designationModel.findAll({
      attributes: ['id', 'uuid', 'name'],
      where: {
        status: DesignationStatus.ACTIVE,
      },
      order: [['name', 'ASC']],
    } as any);
  }

  async findOne(uuid: string, currentUser?: any): Promise<Designation> {
    const designation =
      await this.designationModel.findOne({
        where: { uuid } as any,
        // relation: single designation-এর department
        include: [
          {
            model: this.departmentModel,
            as: 'department',
            required: false,
          },
        ],
      });

    if (!designation) {
      throw new NotFoundException(
        `Designation #${uuid} not found`,
      );
    }

    return designation;
  }

  async update(uuid: string, dto: UpdateDesignationDto, userId?: number, currentUser?: any): Promise<Designation> {
    const designation =
      await this.designationModel.findOne({
        where: { uuid } as any,
      });

    if (!designation) {
      throw new NotFoundException(
        `Designation #${uuid} not found`,
      );
    }

    // relation: (departmentId + name) combo বদলালে duplicate চেক
    const targetName =
      dto.name ?? designation.name;
    const targetDepartmentId =
      dto.departmentId ??
      designation.departmentId;

    if (
      targetName !== designation.name ||
      targetDepartmentId !==
        designation.departmentId
    ) {
      const exists =
        await this.designationModel.findOne({
          where: {
            name: targetName,
            departmentId: targetDepartmentId,
          },
        });

      if (exists && exists.uuid !== uuid) {
        throw new BadRequestException(
          `Designation "${targetName}" already exists in this department`,
        );
      }
    }

    await designation.update({
      ...dto,
      updatedBy: userId ? String(userId) : null,
      ...((dto as any).orgId !== undefined ? { orgId: (dto as any).orgId } : {}),
      ...((dto as any).projectId !== undefined ? { projectId: (dto as any).projectId } : {}),
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const designation =
      await this.designationModel.findOne({
        where: { uuid } as any,
      });

    if (!designation) {
      throw new NotFoundException(
        `Designation #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await designation.update({
      status: DesignationStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await designation.destroy();

    return {
      message: `Designation #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Designation> {
    const designation =
      await this.designationModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!designation) {
      throw new NotFoundException(
        `Designation #${uuid} not found`,
      );
    }

    if (!designation.deletedAt) {
      throw new BadRequestException(
        `Designation #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await designation.restore();
    await designation.update({
      status: DesignationStatus.ACTIVE,
    } as any);

    return this.findOne(uuid);
  }
}
