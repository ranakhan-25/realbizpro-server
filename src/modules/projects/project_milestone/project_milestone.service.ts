/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectMilestone } from 'src/database/models/projects/project_milestone/pr_project_milestone_model';
import { CreateProjectMilestoneDto } from './dto/create-project_milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project_milestone.dto';
import { QueryProjectMilestoneDto } from './dto/query-project_milestone.dto';

@Injectable()
export class ProjectMilestoneService {
  constructor(
    @InjectModel(ProjectMilestone)
    private readonly milestoneModel: typeof ProjectMilestone,
  ) {}

  async create(dto: CreateProjectMilestoneDto): Promise<ProjectMilestone> {
    try {
      return await this.milestoneModel.create({
        ...dto,
        plannedDate: new Date(dto.plannedDate),
        ...(dto.actualDate ? { actualDate: new Date(dto.actualDate) } : {}),
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Milestone code already exists.');
      }
      throw error;
    }
  }

  // ✅ ৫০০ এরর ফিক্স করার জন্য findAll মেথড
  async findAll(query: QueryProjectMilestoneDto) {
    const { page = '1', limit = '10', status, projectUuid, search } = query;
    
    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
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

    if (status) where.status = status;
    if (projectUuid) where.projectUuid = projectUuid;
    if (search && search.trim() !== '') {
      where.milestoneName = { [Op.iLike]: `%${search}%` };
    }

    const { rows, count } = await this.milestoneModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<ProjectMilestone> {
    const milestone = await this.milestoneModel.findOne({ where: { uuid } });
    if (!milestone) throw new NotFoundException(`Milestone ${uuid} not found`);
    return milestone;
  }

  async update(uuid: string, dto: UpdateProjectMilestoneDto): Promise<ProjectMilestone> {
    const milestone = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.plannedDate) updateData.plannedDate = new Date(dto.plannedDate);
    if (dto.actualDate) updateData.actualDate = new Date(dto.actualDate);

    await milestone.update(updateData);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const milestone = await this.findOne(uuid);
    await milestone.destroy();
    return { message: 'Milestone deleted successfully' };
  }
}