import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Project } from 'src/database/models/projects/pr_project_model';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { QueryProjectDto } from './dto/query-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const existing = await this.projectModel.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(
        `Project code "${dto.code}" already exists`,
      );
    }

    const project = await this.projectModel.create({
      ...dto,
      status: dto.status ?? 'ACTIVE',
      progressPercentage: dto.progressPercentage ?? 0,
    });

    return this.findOne(project.id);
  }

  async findAll(query: QueryProjectDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      projectType,
      areaCategory,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { contactPersonName: { [Op.iLike]: `%${search}%` } },
        { contractorCompany: { [Op.iLike]: `%${search}%` } },
        { projectManager: { [Op.iLike]: `%${search}%` } },
        { clientEmail: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (projectType) where.projectType = projectType;
    if (areaCategory) where.areaCategory = areaCategory;

    const { rows, count } = await this.projectModel.findAndCountAll({
      where,
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

  async findOne(id: string | number): Promise<Project> {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return project;
  }

  async update(
    id: string | number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    if (dto.code && dto.code !== project.code) {
      const exists = await this.projectModel.findOne({
        where: { code: dto.code },
      });
      if (exists) {
        throw new BadRequestException(
          `Project code "${dto.code}" already exists`,
        );
      }
    }

    await project.update(dto);
    return this.findOne(id);
  }

  async remove(id: string | number): Promise<{ message: string }> {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    await project.destroy();
    return { message: `Project #${id} deleted successfully` };
  }

  async restore(id: string | number): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      paranoid: false,
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    if (!project.deletedAt) {
      throw new BadRequestException(`Project #${id} is not deleted`);
    }

    await project.restore();
    return this.findOne(id);
  }
}