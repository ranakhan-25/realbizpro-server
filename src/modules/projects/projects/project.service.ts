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
  // FIND PROJECT BY UUID OR NUMERIC ID
  // =========================

  private async findProjectByIdentifier(
    identifier: string,
    includeDeleted = false,
  ): Promise<Project | null> {
    const options = {
      paranoid: !includeDeleted,
    };

    // First: search using UUID
    let project = await this.projectModel.findOne(
      {
        where: {
          uuid: identifier,
        } as any,
        ...options,
      },
    );

    if (project) {
      return project;
    }

    // Fallback: allow numeric database ID
    // only when the route parameter is numeric.
    if (/^\d+$/.test(identifier)) {
      project = await this.projectModel.findByPk(
        identifier,
        options,
      );
    }

    return project;
  }

  // =========================
  // CREATE
  // =========================

  async create(
    dto: CreateProjectDto,
  ): Promise<Project> {
    if (dto.code) {
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

        totalBudget: dto.budget,
        numberOfStoreys: dto.storeys,
        progressPercentage: dto.progress ?? 0,

        status:
          dto.status ?? ProjectStatus.ACTIVE,

        createdBy: dto.createdBy,
        updatedBy: dto.updatedBy,
        deletedBy: dto.deletedBy,
      });

    const identifier = project.uuid;

    if (!identifier) {
      return project;
    }

    return this.findOne(identifier);
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

    const safeLimit = Math.max(
      1,
      Number(limit) || 10,
    );

    const safePage = Math.max(
      1,
      Number(page) || 1,
    );

    const offset =
      skip !== undefined && skip !== null
        ? Math.max(0, Number(skip) || 0)
        : (safePage - 1) * safeLimit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
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
          location: { [Op.iLike]: `%${search}%` },
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
        limit: safeLimit,
        offset,
        order: [[safeSortBy, safeSortOrder]],
        paranoid: !withDeleted,
      });

    const totalPages =
      Math.ceil(count / safeLimit) || 1;

    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(offset / safeLimit) + 1
        : safePage;

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
        limit: safeLimit,
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
      await this.findProjectByIdentifier(
        uuid,
        false,
      );

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
      await this.findProjectByIdentifier(
        uuid,
        false,
      );

    if (!project) {
      throw new NotFoundException(
        `Project #${uuid} not found`,
      );
    }

    if (dto.code && dto.code !== project.code) {
      const existing =
        await this.projectModel.findOne({
          where: {
            code: dto.code,
            uuid: {
              [Op.ne]: project.uuid,
            },
          } as any,
        });

      if (existing) {
        throw new BadRequestException(
          `Project code "${dto.code}" already exists`,
        );
      }
    }

    const updateData: Record<string, any> = {
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
      totalBudget: dto.budget,
      numberOfStoreys: dto.storeys,
      progressPercentage: dto.progress,
    };

    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate
        ? new Date(dto.startDate)
        : null;
    }

    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate
        ? new Date(dto.endDate)
        : null;
    }

    // Do not overwrite existing values with undefined.
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await project.update(updateData);

    return project.reload();
  }

  // =========================
  // REMOVE / SOFT DELETE
  // =========================

  async remove(
    identifier: string,
  ): Promise<{ message: string }> {
    // paranoid: false allows lookup of soft-deleted records too.
    const project =
      await this.findProjectByIdentifier(
        identifier,
        true,
      );

    if (!project) {
      throw new NotFoundException(
        `Project #${identifier} not found. Check the UUID in the database.`,
      );
    }

    if (project.deletedAt) {
      throw new BadRequestException(
        `Project #${identifier} is already deleted`,
      );
    }

    // Keep status unchanged; destroy() handles soft deletion
    // when paranoid: true is configured on the Sequelize model.
    await project.destroy();

    return {
      message: `Project #${project.uuid ?? identifier} deleted successfully`,
    };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string): Promise<Project> {
    const project =
      await this.findProjectByIdentifier(
        uuid,
        true,
      );

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

    await project.restore();

    await project.update({
      status: ProjectStatus.ACTIVE,
    });

    return project.reload();
  }
}
