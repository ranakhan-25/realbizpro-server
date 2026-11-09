/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskPriority, TaskStatus } from 'src/database/models/projects/task/pr_task.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(
    dto: CreateTaskDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Task> {
    const task =
      await this.taskModel.create({
        createdBy: userId ? String(userId) : null,
        orgId: currentUser?.orgId ?? null,
        projectId: currentUser?.projectId ?? null,
        ...dto,
        progress: dto.progress ?? 0,
        status:
          dto.status ??
          TaskStatus.IN_PROGRESS,
        priority:
          dto.priority ??
          TaskPriority.MEDIUM,
      } as any);

    return this.findOne(task.uuid);
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll(
    query: QueryTaskDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      priority,
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

    if (search) {
      where[Op.or] = [
        {
          taskName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          duration: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          uid: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const { rows, count } =
      await this.taskModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

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
      currentPage > 1
        ? currentPage - 1
        : null;

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

  // =========================
  // FIND ONE
  // =========================

  async findOne(
    uuid: string,
    currentUser?: any,
  ): Promise<Task> {
    const task =
      await this.taskModel.findOne({
        where: { uuid } as any,
      });

    if (!task) {
      throw new NotFoundException(
        `Task #${uuid} not found`,
      );
    }

    return task;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    uuid: string,
    dto: UpdateTaskDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Task> {
    const task =
      await this.taskModel.findOne({
        where: { uuid } as any,
      });

    if (!task) {
      throw new NotFoundException(
        `Task #${uuid} not found`,
      );
    }

    await task.update(dto as any);

    return this.findOne(uuid);
  }

  // =========================
  // REMOVE / SOFT DELETE
  // =========================

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const task =
      await this.taskModel.findOne({
        where: { uuid } as any,
      });

    if (!task) {
      throw new NotFoundException(
        `Task #${uuid} not found`,
      );
    }

    await task.update({
      status: TaskStatus.DELAYED,
    } as any);

    await task.destroy();

    return {
      message: `Task #${uuid} deleted successfully`,
    };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Task> {
    const task =
      await this.taskModel.findOne({
        where: {
          uuid,
        } as any,
        paranoid: false,
      });

    if (!task) {
      throw new NotFoundException(
        `Task #${uuid} not found`,
      );
    }

    if (!task.deletedAt) {
      throw new BadRequestException(
        `Task #${uuid} is not deleted`,
      );
    }

    await task.restore();

    await task.update({
      status: TaskStatus.IN_PROGRESS,
    } as any);

    return this.findOne(uuid);
  }
}