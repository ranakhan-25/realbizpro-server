/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Project,
  ProjectStatus,
} from 'src/database/models/projects/project/pr_project_model';

import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(
    dto: CreateProjectDto,
  ): Promise<Project> {
    const existing =
      await this.projectModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Project code "${dto.code}" already exists`,
      );
    }

    const project =
      await this.projectModel.create({
        code: dto.code,
        name: dto.name,

        projectType: dto.projectType,
        areaCategory: dto.areaCategory,
        location: dto.location,
        description: dto.description,

        startDate: dto.startDate
          ? new Date(dto.startDate)
          : undefined,

        endDate: dto.endDate
          ? new Date(dto.endDate)
          : undefined,

        contactPersonName: dto.contactPersonName,

        contactPhone: dto.contactPhone,

        clientEmail: dto.clientEmail,

        contractorCompany: dto.contractorCompany,

        projectManager: dto.projectManager,

        // DTO field → Model field
        totalBudget: dto.budget,

        // DTO field → Model field
        numberOfStoreys: dto.storeys,

        // DTO field → Model field
        progressPercentage: dto.progress ?? 0,

        status:
          dto.status ?? ProjectStatus.ACTIVE,

        createdBy: dto.createdBy,

        updatedBy: dto.updatedBy,

        deletedBy: dto.deletedBy,
      });

    return this.findOne(project.uuid);
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll(query: QueryProjectDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      projectType,
      areaCategory,
      location,
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

    if (search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectType: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          areaCategory: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          location: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          contactPersonName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          contactPhone: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          clientEmail: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          contractorCompany: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectManager: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (areaCategory) {
      where.areaCategory = areaCategory;
    }

    if (location) {
      where.location = location;
    }

    if (status) {
      where.status = status;
    }

    const allowedSortFields = [
      'id',
      'createdAt',
      'updatedAt',
      'code',
      'name',
      'projectType',
      'areaCategory',
      'location',
      'totalBudget',
      'numberOfStoreys',
      'progressPercentage',
      'status',
    ];

    const safeSortBy = allowedSortFields.includes(
      sortBy,
    )
      ? sortBy
      : 'createdAt';

    const safeSortOrder =
      String(sortOrder).toUpperCase() === 'ASC'
        ? 'ASC'
        : 'DESC';

    const { rows, count } =
      await this.projectModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[safeSortBy, safeSortOrder]],
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

  // =========================
  // FIND ONE
  // =========================

  async findOne(uuid: string): Promise<Project> {
    const project =
      await this.projectModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!project) {
      throw new NotFoundException(
        `Project #${uuid} not found`,
      );
    }

    return project;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    uuid: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project =
      await this.projectModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!project) {
      throw new NotFoundException(
        `Project #${uuid} not found`,
      );
    }

    // Check duplicate project code
    if (dto.code && dto.code !== project.code) {
      const exists =
        await this.projectModel.findOne({
          where: {
            code: dto.code,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Project code "${dto.code}" already exists`,
        );
      }
    }

    const updateData: any = {
      code: dto.code,
      name: dto.name,

      projectType: dto.projectType,

      areaCategory: dto.areaCategory,

      location: dto.location,

      description: dto.description,

      contactPersonName: dto.contactPersonName,

      contactPhone: dto.contactPhone,

      clientEmail: dto.clientEmail,

      contractorCompany: dto.contractorCompany,

      projectManager: dto.projectManager,

      createdBy: dto.createdBy,

      updatedBy: dto.updatedBy,

      deletedBy: dto.deletedBy,

      status: dto.status,

      // DTO → Model
      totalBudget: dto.budget,

      // DTO → Model
      numberOfStoreys: dto.storeys,

      // DTO → Model
      progressPercentage: dto.progress,
    };

    // Only update startDate when provided
    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate
        ? new Date(dto.startDate)
        : null;
    }

    // Only update endDate when provided
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate
        ? new Date(dto.endDate)
        : null;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await project.update(updateData);

    return this.findOne(uuid);
  }

  // =========================
  // REMOVE / SOFT DELETE
  // =========================

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const project =
      await this.projectModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!project) {
      throw new NotFoundException(
        `Project #${uuid} not found`,
      );
    }

    // ProjectStatus.INACTIVE does not exist.
    // Use CANCELLED before soft delete.
    await project.update({
      status: ProjectStatus.CANCELLED,
    });

    await project.destroy();

    return {
      message: `Project #${uuid} deleted successfully`,
    };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string): Promise<Project> {
    const project =
      await this.projectModel.findOne({
        where: {
          uuid,
        } as any,
        paranoid: false,
      });

    if (!project) {
      throw new NotFoundException(
        `Project #${uuid} not found`,
      );
    }

    if (!project.deletedAt) {
      throw new BadRequestException(
        `Project #${uuid} is not deleted`,
      );
    }

    // Restore soft-deleted project
    await project.restore();

    // Status → active
    await project.update({
      status: ProjectStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
