/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { CreateProjectSiteDto } from './dto/create-project-site.dto';
import { QueryProjectSiteDto } from './dto/query-project-site.dto';
import { UpdateProjectSiteDto } from './dto/update-project-site.dto';

@Injectable()
export class ProjectSiteService {
  constructor(
    @InjectModel(Site)
    private readonly siteModel: typeof Site,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateProjectSiteDto, userId?: number, currentUser?: any) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const existing = await this.siteModel.findOne({
        where: { code: dto.code } as WhereOptions<Site>,
        transaction,
      });
      if (existing) {
        throw new ConflictException(
          `Site code "${dto.code}" already exists`,
        );
      }

      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      if (!project) {
        throw new BadRequestException(
          `Project "${dto.projectId}" not found`,
        );
      }

      const site = await this.siteModel.create(
        {
          ...dto,
          createdBy: userId ? String(userId) : undefined,
        },
        { transaction },
      );
      return site.uuid;
    });

    return this.findOne(uuid);
  }

  async findAll(
    query: QueryProjectSiteDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: WhereOptions<Site> = search
      ? {
          [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { name: { [Op.iLike]: `%${search}%` } },
            { location: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await this.siteModel.findAndCountAll({
      where: where as WhereOptions<Site>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
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

  async findOne(uuid: string, currentUser?: any): Promise<Site> {
    const site = await this.siteModel.findOne({
      where: { uuid } as WhereOptions<Site>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
    });

    if (!site) {
      throw new NotFoundException(`Site "${uuid}" not found`);
    }

    return site;
  }

  async update(
    uuid: string,
    dto: UpdateProjectSiteDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Site> {
    await this.sequelize.transaction(async (transaction) => {
      const site = await this.siteModel.findOne({
        where: { uuid } as WhereOptions<Site>,
        transaction,
      });
      if (!site) {
        throw new NotFoundException(`Site "${uuid}" not found`);
      }

      if (dto.code && dto.code !== site.code) {
        const existing = await this.siteModel.findOne({
          where: {
            code: dto.code,
            uuid: { [Op.ne]: uuid },
          } as WhereOptions<Site>,
          transaction,
        });
        if (existing) {
          throw new ConflictException(
            `Site code "${dto.code}" already exists`,
          );
        }
      }

      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: dto.projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(
            `Project "${dto.projectId}" not found`,
          );
        }
      }

      await site.update(
        {
          ...dto,
          updatedBy: userId ? String(userId) : undefined,
        },
        { transaction },
      );
    });

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const site = await this.siteModel.findOne({
      where: { uuid } as WhereOptions<Site>,
    });
    if (!site) {
      throw new NotFoundException(`Site "${uuid}" not found`);
    }

    await site.destroy();
    return { message: `Site "${uuid}" deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Site> {
    const site = await this.siteModel.findOne({
      where: { uuid } as WhereOptions<Site>,
      paranoid: false,
    });

    if (!site) {
      throw new NotFoundException(`Site "${uuid}" not found`);
    }
    if (!site.deletedAt) {
      throw new BadRequestException(`Site "${uuid}" is not deleted`);
    }

    await site.restore();
    return this.findOne(uuid);
  }
}
