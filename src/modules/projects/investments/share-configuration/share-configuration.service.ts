/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import {
  ShareConfiguration,
  ShareConfigurationStatus,
} from 'src/database/models/projects/investor/configuration.model';

import { Investor } from 'src/database/models/projects/investor/investor.model';

import { CreateShareConfigurationDto } from './dto/create-share-configuration.dto';
import { QueryShareConfigurationDto } from './dto/query-share-configuration.dto';
import { UpdateShareConfigurationDto } from './dto/update-share-configuration.dto';
import { Project } from 'src/database/models/projects/project/pr_project.model';

@Injectable()
export class ShareConfigurationService {
  constructor(
    @InjectModel(ShareConfiguration)
    private readonly shareConfigurationModel: typeof ShareConfiguration,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(Investor)
    private readonly investorModel: typeof Investor,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    dto: CreateShareConfigurationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ShareConfiguration> {
    // -------------------------------------------------------
    // Check Project UUID
    // -------------------------------------------------------

    const project =
      await this.projectModel.findOne({
        where: {
          uuid: dto.projectId,
        } as any,
      });

    if (!project) {
      throw new NotFoundException(
        `Project with UUID ${dto.projectId} not found`,
      );
    }

    // -------------------------------------------------------
    // Check Investor UUID
    // -------------------------------------------------------

    const investor =
      await this.investorModel.findOne({
        where: {
          uuid: dto.investorId,
        } as any,
      });

    if (!investor) {
      throw new NotFoundException(
        `Investor with UUID ${dto.investorId} not found`,
      );
    }

    // -------------------------------------------------------
    // Check Duplicate Project + Investor
    // -------------------------------------------------------

    const existing =
      await this.shareConfigurationModel.findOne({
        where: {
          projectId: dto.projectId,
          investorId: dto.investorId,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Share configuration for this project and investor already exists',
      );
    }

    // -------------------------------------------------------
    // Create
    // -------------------------------------------------------

    const shareConfiguration =
      await this.shareConfigurationModel.create(({
        projectId: dto.projectId,
        investorId: dto.investorId,

        investmentAmount:
          dto.investmentAmount ?? 0,

        profitPercent: dto.profitPercent ?? null,

        fixedProfitAmount:
          dto.fixedProfitAmount ?? null,

        isProfitDistribute:
          dto.isProfitDistribute ?? false,

        addedById: dto.addedById,
        createdBy: dto.createdBy ?? dto.addedById,
        orgId: dto.orgId,

        status:
          dto.status ??
          ShareConfigurationStatus.ACTIVE,
      }) as any);

    return this.findOne(shareConfiguration.uuid);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(
    query: QueryShareConfigurationDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      projectId,
      investorId,
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
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    // -------------------------------------------------------
    // Search
    // -------------------------------------------------------

    if (search) {
      where[Op.or] = [
        {
          projectId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          investorId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          addedById: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // -------------------------------------------------------
    // Filters
    // -------------------------------------------------------

    if (projectId) {
      where.projectId = projectId;
    }

    if (investorId) {
      where.investorId = investorId;
    }

    if (status) {
      where.status = status;
    }

    // -------------------------------------------------------
    // Safe Sorting
    // -------------------------------------------------------

    const allowedSortFields = [
      'id',
      'createdAt',
      'updatedAt',
      'investmentAmount',
      'profitPercent',
      'fixedProfitAmount',
      'status',
    ];

    const safeSortBy = allowedSortFields.includes(
      sortBy,
    )
      ? sortBy
      : 'createdAt';

    const safeSortOrder =
      sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // -------------------------------------------------------
    // Query
    // -------------------------------------------------------

    const { rows, count } =
      await this.shareConfigurationModel.findAndCountAll(
        {
          where,

          limit,

          offset,

          order: [[safeSortBy, safeSortOrder]],

          paranoid: !withDeleted,

          include: [
            {
              association: 'project',
              required: false,
            },
            {
              association: 'investor',
              required: false,
            },
          ],

          distinct: true,
        },
      );

    // -------------------------------------------------------
    // Pagination
    // -------------------------------------------------------

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

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(
    uuid: string,
    currentUser?: any,
  ): Promise<ShareConfiguration> {
    const shareConfiguration =
      await this.shareConfigurationModel.findOne({
        where: {
          uuid,
        } as any,

        include: [
          {
            association: 'project',
            required: false,
          },
          {
            association: 'investor',
            required: false,
          },
        ],
      });

    if (!shareConfiguration) {
      throw new NotFoundException(
        `Share configuration #${uuid} not found`,
      );
    }

    return shareConfiguration;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    uuid: string,
    dto: UpdateShareConfigurationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ShareConfiguration> {
    const shareConfiguration =
      await this.shareConfigurationModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!shareConfiguration) {
      throw new NotFoundException(
        `Share configuration #${uuid} not found`,
      );
    }

    // -------------------------------------------------------
    // Check Project UUID if provided
    // -------------------------------------------------------

    if (dto.projectId) {
      const project =
        await this.projectModel.findOne({
          where: {
            uuid: dto.projectId,
          } as any,
        });

      if (!project) {
        throw new NotFoundException(
          `Project with UUID ${dto.projectId} not found`,
        );
      }
    }

    // -------------------------------------------------------
    // Check Investor UUID if provided
    // -------------------------------------------------------

    if (dto.investorId) {
      const investor =
        await this.investorModel.findOne({
          where: {
            uuid: dto.investorId,
          } as any,
        });

      if (!investor) {
        throw new NotFoundException(
          `Investor with UUID ${dto.investorId} not found`,
        );
      }
    }

    // -------------------------------------------------------
    // Check Duplicate Project + Investor
    // -------------------------------------------------------

    if (
      (dto.projectId &&
        dto.projectId !==
          shareConfiguration.projectId) ||
      (dto.investorId &&
        dto.investorId !==
          shareConfiguration.investorId)
    ) {
      const finalProjectId =
        dto.projectId ??
        shareConfiguration.projectId;

      const finalInvestorId =
        dto.investorId ??
        shareConfiguration.investorId;

      const exists =
        await this.shareConfigurationModel.findOne(
          {
            where: {
              projectId: finalProjectId,
              investorId: finalInvestorId,

              uuid: {
                [Op.ne]: uuid,
              },
            } as any,
          },
        );

      if (exists) {
        throw new BadRequestException(
          'Share configuration for this project and investor already exists',
        );
      }
    }

    // -------------------------------------------------------
    // Update
    // -------------------------------------------------------

    await shareConfiguration.update(({
      ...dto,
    }) as any);

    return this.findOne(uuid);
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const shareConfiguration =
      await this.shareConfigurationModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!shareConfiguration) {
      throw new NotFoundException(
        `Share configuration #${uuid} not found`,
      );
    }

    // Status → inactive
    await shareConfiguration.update(({
      status: ShareConfigurationStatus.INACTIVE,
    }) as any);

    // Soft delete
    await shareConfiguration.destroy();

    return {
      message: `Share configuration #${uuid} deleted successfully`,
    };
  }

  // =========================================================
  // RESTORE
  // =========================================================

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<ShareConfiguration> {
    const shareConfiguration =
      await this.shareConfigurationModel.findOne({
        where: {
          uuid,
        } as any,

        paranoid: false,
      });

    if (!shareConfiguration) {
      throw new NotFoundException(
        `Share configuration #${uuid} not found`,
      );
    }

    if (!shareConfiguration.deletedAt) {
      throw new BadRequestException(
        `Share configuration #${uuid} is not deleted`,
      );
    }

    // Restore
    await shareConfiguration.restore();

    // Status → active
    await shareConfiguration.update(({
      status: ShareConfigurationStatus.ACTIVE,
    }) as any);

    return this.findOne(uuid);
  }
}
