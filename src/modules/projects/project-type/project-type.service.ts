import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { QueryProjectTypeDto } from './dto/query-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';

@Injectable()
export class ProjectTypeService {
  constructor(
    @InjectModel(ProjectType)
    private readonly projectTypeModel: typeof ProjectType,
  ) {}

  async create(dto: CreateProjectTypeDto, userId?: number) {
    if (dto.code) {
      await this.ensureCodeUnique(dto.code);
    }

    const projectType = await this.projectTypeModel.create({
      ...dto,
      createdBy: userId ? String(userId) : undefined,
    });
    return projectType;
  }

  async findAll(query: QueryProjectTypeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: WhereOptions<ProjectType> = search
      ? {
          [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { name: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } =
      await this.projectTypeModel.findAndCountAll({
        where: where as WhereOptions<ProjectType>,
        order: [['id', 'ASC']],
        limit,
        offset: (page - 1) * limit,
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

  async findOne(uuid: string) {
    const projectType = await this.projectTypeModel.findOne({
      where: { uuid } as WhereOptions<ProjectType>,
    });

    if (!projectType) {
      throw new NotFoundException(
        `Project type "${uuid}" not found`,
      );
    }

    return projectType;
  }

  async update(
    uuid: string,
    dto: UpdateProjectTypeDto,
    userId?: number,
  ) {
    const projectType = await this.findOne(uuid);

    if (dto.code && dto.code !== projectType.code) {
      const existing = await this.projectTypeModel.findOne({
        where: {
          code: dto.code,
          uuid: { [Op.ne]: uuid },
        } as WhereOptions<ProjectType>,
      });

      if (existing) {
        throw new ConflictException(
          `Code "${dto.code}" already exists`,
        );
      }
    }

    await projectType.update({
      ...dto,
      updatedBy: userId ? String(userId) : undefined,
    });
    return projectType;
  }

  async remove(uuid: string) {
    const projectType = await this.findOne(uuid);
    await projectType.destroy();
    return { message: 'Project type deleted successfully' };
  }

  private async ensureCodeUnique(code: string) {
    const exists = await this.projectTypeModel.findOne({
      where: { code } as WhereOptions<ProjectType>,
    });

    if (exists) {
      throw new ConflictException(`Code "${code}" already exists`);
    }
  }
}
