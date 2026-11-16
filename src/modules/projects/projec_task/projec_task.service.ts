/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectTask } from 'src/database/models/projects/project-task/pr_project-task_model';
import { CreateProjectTaskDto } from './dto/create-projec_task.dto';
import { QueryProjectTaskDto } from './dto/query-projec_task.dto';
import { UpdateProjectTaskDto } from './dto/update-projec_task.dto';


@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectModel(ProjectTask)
    private readonly taskModel: typeof ProjectTask,
  ) {}

  async create(
    createDto: CreateProjectTaskDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ProjectTask> {
    try {
      return await this.taskModel.create(createDto as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Task code already exists.');
      }
      throw error;
    }
  }

  async findAll(
    query: QueryProjectTaskDto,
    currentUser?: any,
  ) {
    const { page = '1', limit = '10', search, ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const whereClause: any = {};
    if ((query as any)?.orgId) {
      whereClause.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      whereClause.projectId = (query as any).projectId;
    }
    if ((query as any)?.orgId) {
      whereClause.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      whereClause.projectId = (query as any).projectId;
    }
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        whereClause[key] = value;
      }
    });

    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { taskCode: { [Op.iLike]: `%${search}%` } },
        { assignee: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.taskModel.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  // ✅ Fix: Find by uuid instead of uid
  async findOne(uuid: string, currentUser?: any): Promise<ProjectTask> {
    const task = await this.taskModel.findOne({ where: { uuid } });
    if (!task) {
      throw new NotFoundException(`Task with UUID ${uuid} not found`);
    }
    return task;
  }

  // ✅ Fix: Update by uuid
  async update(
    uuid: string,
    updateDto: UpdateProjectTaskDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ProjectTask> {
    const task = await this.findOne(uuid);
    const { dueDate, ...attributes } = updateDto;

    return task.update(({
      ...attributes,
      ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
    }) as any);
  }

  // ✅ Fix: Remove by uuid
  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const task = await this.findOne(uuid);
    
    await task.update({ deletedBy: userId ? String(userId) : null } as any);
    await task.destroy();
    return { message: 'Task deleted successfully' };
  }

  // ✅ Fix: Restore by uuid
  async restore(uuid: string, userId?: number, currentUser?: any): Promise<ProjectTask> {
    const task = await this.taskModel.findOne({ 
      where: { uuid },
      paranoid: false 
    });

    if (!task) {
      throw new NotFoundException(`Task with UUID ${uuid} not found`);
    }

    if (!task.deletedAt) {
      throw new BadRequestException('Task is not deleted');
    }

    await task.restore();
    await task.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return task;
  }
}