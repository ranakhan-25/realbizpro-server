import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { projectType } from 'src/database/models/projects/pr_project_types_model';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { QueryProjectTypeDto } from './dto/query-project-type.dto';

@Injectable()
export class ProjectTypeService {
  constructor(
    @InjectModel(projectType)
    private readonly projectTypeModel: typeof projectType,
  ) {}

  async create(dto: CreateProjectTypeDto) {
    if (dto.code) {
      await this.ensureCodeUnique(dto.code);
    }
    return this.projectTypeModel.create(dto as any);
  }

  async findAll(query: QueryProjectTypeDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = query;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.projectTypeModel.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
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

  async findOne(id: number) {
    const projectType = await this.projectTypeModel.findByPk(id);
    if (!projectType) {
      throw new NotFoundException(`Project type #${id} not found`);
    }
    return projectType;
  }

  async update(id: number, dto: UpdateProjectTypeDto) {
    const projectType = await this.findOne(id);

    if (dto.code && dto.code !== projectType.code) {
      await this.ensureCodeUnique(dto.code);
    }

    return projectType.update(dto as any);
  }

  async remove(id: number) {
    const projectType = await this.findOne(id);
    await projectType.destroy(); // paranoid: true, tai soft delete
    return { message: 'Project type deleted successfully' };
  }

  private async ensureCodeUnique(code: string) {
    const exists = await this.projectTypeModel.findOne({ where: { code } });
    if (exists) {
      throw new ConflictException(`Code "${code}" already exists`);
    }
  }
}