/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectShareConfiguration } from 'src/database/models/projects/project-share-configuration/pr_project_share_configuration.model';
import { CreateProjectShareConfigurationDto } from './dto/create-project-share-configuration.dto';
import { QueryProjectShareConfigurationDto } from './dto/query-project-share-configuration.dto';
import { UpdateProjectShareConfigurationDto } from './dto/update-project-share-configuration.dto';

@Injectable()
export class ProjectShareConfigurationService {
  constructor(
    @InjectModel(ProjectShareConfiguration)
    private readonly configurationModel: typeof ProjectShareConfiguration,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateProjectShareConfigurationDto, userId?: number) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      if (!project) {
        throw new BadRequestException(`Project "${dto.projectId}" not found`);
      }
      const configuration = await this.configurationModel.create(
        {
          ...dto,
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return configuration.uuid;
    });
    return this.findOne(uuid);
  }

  async findAll(query: QueryProjectShareConfigurationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<ProjectShareConfiguration> = search
      ? {
          [Op.or]: [
            { titleName: { [Op.iLike]: `%${search}%` } },
            { shareType: { [Op.iLike]: `%${search}%` } },
            { taskNames: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows, count } = await this.configurationModel.findAndCountAll({
      where: where as WhereOptions<ProjectShareConfiguration>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(uuid: string) {
    const configuration = await this.configurationModel.findOne({
      where: { uuid } as WhereOptions<ProjectShareConfiguration>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
    });
    if (!configuration) {
      throw new NotFoundException(`Share configuration "${uuid}" not found`);
    }
    return configuration;
  }

  async update(
    uuid: string,
    dto: UpdateProjectShareConfigurationDto,
    userId?: number,
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const configuration = await this.configurationModel.findOne({
        where: { uuid } as WhereOptions<ProjectShareConfiguration>,
        transaction,
      });
      if (!configuration) {
        throw new NotFoundException(`Share configuration "${uuid}" not found`);
      }
      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: dto.projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(`Project "${dto.projectId}" not found`);
        }
      }
      await configuration.update(
        {
          ...dto,
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const configuration = await this.configurationModel.findOne({
      where: { uuid } as WhereOptions<ProjectShareConfiguration>,
    });
    if (!configuration) {
      throw new NotFoundException(`Share configuration "${uuid}" not found`);
    }
    await configuration.destroy();
    return { message: `Share configuration "${uuid}" deleted successfully` };
  }
}
