import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectDocument } from 'src/database/models/projects/project-document/pr_project_document.model';
import { CreateProjectDocumentDto } from './dto/create-project-document.dto';
import { QueryProjectDocumentDto } from './dto/query-project-document.dto';
import { UpdateProjectDocumentDto } from './dto/update-project-document.dto';

@Injectable()
export class ProjectDocumentService {
  constructor(
    @InjectModel(ProjectDocument)
    private readonly documentModel: typeof ProjectDocument,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateProjectDocumentDto, userId?: number, currentUser?: any) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      if (!project) {
        throw new BadRequestException(
          `Project "${dto.projectId}" not found`,
        );
      }

      const document = await this.documentModel.create(
        {
          ...dto,
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return document.uuid;
    });

    return this.findOne(uuid);
  }

  async findAll(
    query: QueryProjectDocumentDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<ProjectDocument> = {
      ...(search
        ? {
            [Op.or]: [
              { documentName: { [Op.iLike]: `%${search}%` } },
              { documentType: { [Op.iLike]: `%${search}%` } },
              { details: { [Op.iLike]: `%${search}%` } },
              { rajuk: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };

    const { rows, count } = await this.documentModel.findAndCountAll({
      where: where as WhereOptions<ProjectDocument>,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['uuid', 'code', 'name'],
        },
      ],
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

  async findOne(uuid: string, currentUser?: any): Promise<ProjectDocument> {
    const document = await this.documentModel.findOne({
      where: { uuid } as WhereOptions<ProjectDocument>,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['uuid', 'code', 'name'],
        },
      ],
    });
    if (!document) {
      throw new NotFoundException(
        `Project document "${uuid}" not found`,
      );
    }
    return document;
  }

  async update(
    uuid: string,
    dto: UpdateProjectDocumentDto,
    userId?: number,
    currentUser?: any,
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const document = await this.documentModel.findOne({
        where: { uuid } as WhereOptions<ProjectDocument>,
        transaction,
      });
      if (!document) {
        throw new NotFoundException(
          `Project document "${uuid}" not found`,
        );
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

      await document.update(
        {
          ...dto,
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const document = await this.documentModel.findOne({
      where: { uuid } as WhereOptions<ProjectDocument>,
    });
    if (!document) {
      throw new NotFoundException(
        `Project document "${uuid}" not found`,
      );
    }
    await document.destroy();
    return { message: `Project document "${uuid}" deleted successfully` };
  }
}
