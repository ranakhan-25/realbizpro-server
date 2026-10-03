import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Site } from 'src/database/models/projects/pr_site.model';
import { Project } from 'src/database/models/projects/pr_project_model';
import type { CreateProjectSiteDto } from './dto/create-project-site.dto';

import type { UpdateProjectSiteDto } from './dto/update-project-site.dto';
import { QueryProjectSiteDto } from './dto/query-site.dto';

@Injectable()
export class ProjectSiteService {
  constructor(
    @InjectModel(Site)
    private readonly siteModel: typeof Site,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async create(
    dto: CreateProjectSiteDto,
  ): Promise<Site> {
    const existing = await this.siteModel.findOne(
      {
        where: { code: dto.code },
      },
    );
    if (existing) {
      throw new BadRequestException(
        `Site code "${dto.code}" already exists`,
      );
    }

    const project =
      await this.projectModel.findByPk(
        dto.projectId,
      );
    if (!project) {
      throw new BadRequestException(
        `Project #${dto.projectId} not found`,
      );
    }

    const site = await this.siteModel.create({
      ...dto,
    });
    return this.findOne(site.id);
  }

  async findAll(query: QueryProjectSiteDto) {
    const {
      page = 1,
      limit = 10,
      search,
      projectType,
      projectId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        {
          location: { [Op.iLike]: `%${search}%` },
        },
        {
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (projectType)
      where.projectType = projectType;
    if (projectId) where.projectId = projectId;

    const { rows, count } =
      await this.siteModel.findAndCountAll({
        where,
        include: [
          {
            model: this.projectModel,
            attributes: ['id', 'code', 'name'],
          },
        ],
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(
    id: string | number,
  ): Promise<Site> {
    const site = await this.siteModel.findByPk(
      id,
      {
        include: [
          {
            model: this.projectModel,
            attributes: ['id', 'code', 'name'],
          },
        ],
      },
    );

    if (!site) {
      throw new NotFoundException(
        `Site #${id} not found`,
      );
    }

    return site;
  }

  async update(
    id: string | number,
    dto: UpdateProjectSiteDto,
  ): Promise<Site> {
    const site =
      await this.siteModel.findByPk(id);
    if (!site) {
      throw new NotFoundException(
        `Site #${id} not found`,
      );
    }

    if (dto.code && dto.code !== site.code) {
      const exists = await this.siteModel.findOne(
        {
          where: { code: dto.code },
        },
      );
      if (exists) {
        throw new BadRequestException(
          `Site code "${dto.code}" already exists`,
        );
      }
    }

    if (dto.projectId) {
      const project =
        await this.projectModel.findByPk(
          dto.projectId,
        );
      if (!project) {
        throw new BadRequestException(
          `Project #${dto.projectId} not found`,
        );
      }
    }

    await site.update(dto);
    return this.findOne(id);
  }

  async remove(
    id: string | number,
  ): Promise<{ message: string }> {
    const site =
      await this.siteModel.findByPk(id);
    if (!site) {
      throw new NotFoundException(
        `Site #${id} not found`,
      );
    }

    await site.destroy();
    return {
      message: `Site #${id} deleted successfully`,
    };
  }

  async restore(
    id: string | number,
  ): Promise<Site> {
    const site = await this.siteModel.findByPk(
      id,
      { paranoid: false },
    );

    if (!site) {
      throw new NotFoundException(
        `Site #${id} not found`,
      );
    }

    if (!site.deletedAt) {
      throw new BadRequestException(
        `Site #${id} is not deleted`,
      );
    }

    await site.restore();
    return this.findOne(id);
  }
}
