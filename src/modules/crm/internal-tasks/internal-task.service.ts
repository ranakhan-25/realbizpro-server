import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Includeable, Op, Transaction } from 'sequelize';
import { CrmInternalTask, CrmInternalTaskAssignee, TaskType } from 'src/database/models/crm/configuration/crm-task-type.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateInternalTaskDto, INTERNAL_TASK_PRIORITIES, INTERNAL_TASK_STATUSES } from './dto/create-internal-task.dto';
import { QueryInternalTaskDto } from './dto/query-internal-task.dto';
import { UpdateInternalTaskDto } from './dto/update-internal-task.dto';

const INCLUDE: Includeable[] = [
  { association: 'taskType', attributes: ['uuid', 'name', 'code'], required: false },
  { association: 'lead', attributes: ['uuid', 'leadCode', 'clientName'], required: false },
  { association: 'assignees', attributes: ['uuid', 'userId', 'status'], required: false },
];

@Injectable()
export class InternalTaskService {
  constructor(
    @InjectModel(CrmInternalTask) private readonly tasks: typeof CrmInternalTask,
    @InjectModel(CrmInternalTaskAssignee) private readonly assignees: typeof CrmInternalTaskAssignee,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(TaskType) private readonly taskTypes: typeof TaskType,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateInternalTaskDto, actor?: string) {
    return this.sequelize.transaction(async transaction => {
      const relations = await this.resolveRelations(dto, transaction);
      const task = await this.tasks.create({
        title: dto.title.trim(), description: dto.description?.trim() || null,
        priority: dto.priority, status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        projectId: relations.project?.code ?? null,
        taskTypeId: relations.taskType?.id ?? null,
        relatedLeadId: relations.lead?.id ?? null,
        createdBy: actor,
      } as any, { transaction });
      await this.syncAssignees(task, dto.assignedTo ?? [], actor, transaction, relations.project?.code);
      return this.findOne(task.uuid, transaction);
    });
  }

  async findAll(query: QueryInternalTaskDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.projectCode) where.projectId = query.projectCode;
    const include = [...INCLUDE];
    if (query.assignedTo) {
      include[2] = { association: 'assignees', required: true, where: { userId: query.assignedTo } };
    }
    const { rows, count } = await this.tasks.findAndCountAll({
      attributes: ['uuid', 'title', 'description', 'priority', 'status', 'dueDate', 'projectId', 'taskTypeId', 'relatedLeadId', 'createdBy', 'createdAt', 'updatedAt'],
      where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
    });
    const relations = await this.resolvePublicRelations(rows);
    return { data: rows.map(row => this.toPublic(row, relations)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const row = await this.tasks.findOne({ where: { uuid }, include: INCLUDE, transaction });
    if (!row) throw new NotFoundException(`Internal task ${uuid} not found`);
    const relations = await this.resolvePublicRelations([row], transaction);
    return this.toPublic(row, relations);
  }

  async update(uuid: string, dto: UpdateInternalTaskDto, actor?: string) {
    return this.sequelize.transaction(async transaction => {
      const task = await this.tasks.findOne({ where: { uuid }, transaction });
      if (!task) throw new NotFoundException(`Internal task ${uuid} not found`);
      const relations = await this.resolveRelations(dto, transaction);
      const changes: Record<string, any> = {};
      if (dto.title !== undefined) changes.title = dto.title.trim();
      if (dto.description !== undefined) changes.description = dto.description.trim() || null;
      if (dto.priority !== undefined) changes.priority = dto.priority;
      if (dto.status !== undefined) changes.status = dto.status;
      if (dto.dueDate !== undefined) changes.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
      if (dto.projectCode !== undefined) changes.projectId = relations.project?.code ?? null;
      if (dto.taskTypeUuid !== undefined) changes.taskTypeId = relations.taskType?.id ?? null;
      if (dto.relatedLeadUuid !== undefined) changes.relatedLeadId = relations.lead?.id ?? null;
      if (actor) changes.updatedBy = actor;
      await task.update(changes, { transaction });
      if (dto.assignedTo !== undefined) await this.syncAssignees(task, dto.assignedTo, actor, transaction, task.projectId);
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string, actor?: string) {
    const task = await this.tasks.findOne({ where: { uuid } });
    if (!task) throw new NotFoundException(`Internal task ${uuid} not found`);
    if (actor) await task.update({ deletedBy: actor });
    await task.destroy();
    return { message: `Internal task ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const task = await this.tasks.findOne({ where: { uuid }, paranoid: false });
    if (!task) throw new NotFoundException(`Internal task ${uuid} not found`);
    if (!task.deletedAt) throw new BadRequestException(`Internal task ${uuid} is not deleted`);
    await task.restore();
    return this.findOne(uuid);
  }

  async dropdowns() {
    const [projects, users, taskTypes] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'name', 'code'], order: [['name', 'ASC']] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.taskTypes.findAll({ attributes: ['uuid', 'name', 'code'], order: [['name', 'ASC']] }),
    ]);
    return {
      projects: projects.map(({ uuid, name, code }) => ({ id: code, code, uuid, name })),
      assignees: users.map(({ uuid, userCode, name }) => ({ id: userCode ?? uuid, userCode, uuid, name })),
      taskTypes: taskTypes.map(({ uuid, name, code }) => ({ uuid, name, code })),
      priorities: [...INTERNAL_TASK_PRIORITIES],
      statuses: [...INTERNAL_TASK_STATUSES],
    };
  }

  private async resolvePublicRelations(rows: CrmInternalTask[], transaction?: Transaction) {
    const taskData = rows.map(row => row.toJSON() as Record<string, any>);
    const projectCodes = [...new Set(taskData.map(item => item.projectId).filter((value): value is string => typeof value === 'string' && value.length > 0))];
    const userIds = [...new Set(taskData.flatMap(item => (item.assignees ?? []).map((assignee: any) => assignee.userId).filter((value: unknown): value is string => typeof value === 'string' && value.length > 0)))];
    const projects = projectCodes.length
      ? await this.projects.findAll({ where: { code: { [Op.in]: projectCodes } } as any, attributes: ['uuid', 'name', 'code'], transaction })
      : [];
    const users = userIds.length
      ? await this.users.findAll({ where: { [Op.or]: [{ userCode: { [Op.in]: userIds } }, { uuid: { [Op.in]: userIds } }] } as any, attributes: ['uuid', 'userCode', 'name'], transaction })
      : [];
    return {
      projects: new Map(projects.map(project => [project.code, { uuid: project.uuid, name: project.name, code: project.code }])),
      users: new Map(users.flatMap(user => [[user.uuid, user], ...(user.userCode ? [[user.userCode, user]] : [])] as [string, SysUser][])),
    };
  }

  private async resolveRelations(dto: Partial<CreateInternalTaskDto>, transaction: Transaction) {
    const [project, taskType, lead] = await Promise.all([
      dto.projectCode ? this.projects.findOne({ where: { code: dto.projectCode } as any, transaction }) : Promise.resolve(null),
      dto.taskTypeUuid ? this.taskTypes.findOne({ where: { uuid: dto.taskTypeUuid }, transaction }) : Promise.resolve(null),
      dto.relatedLeadUuid ? this.leads.findOne({ where: { uuid: dto.relatedLeadUuid }, transaction }) : Promise.resolve(null),
    ]);
    if (dto.projectCode && !project) throw new BadRequestException(`Project ${dto.projectCode} not found`);
    if (dto.taskTypeUuid && !taskType) throw new BadRequestException(`Task type ${dto.taskTypeUuid} not found`);
    if (dto.relatedLeadUuid && !lead) throw new BadRequestException(`Lead ${dto.relatedLeadUuid} not found`);
    return { project, taskType, lead };
  }

  private async syncAssignees(task: CrmInternalTask, userUuids: string[], actor: string | undefined, transaction: Transaction, projectUuid?: string | null) {
    const distinctIds = [...new Set(userUuids)];
    const users = distinctIds.length ? await this.users.findAll({ where: { [Op.or]: [{ userCode: { [Op.in]: distinctIds } }, { uuid: { [Op.in]: distinctIds } }] } as any, attributes: ['uuid', 'userCode'], transaction }) : [];
    if (users.length !== distinctIds.length) throw new BadRequestException('One or more assigned users were not found');
    const userIdByInput = new Map(users.flatMap(user => [[user.uuid, user.userCode ?? user.uuid], ...(user.userCode ? [[user.userCode, user.userCode]] : [])] as [string, string][]));
    await this.assignees.destroy({ where: { taskId: task.id }, transaction });
    if (distinctIds.length) await this.assignees.bulkCreate(distinctIds.map(inputId => ({ taskId: task.id, userId: userIdByInput.get(inputId)!, assignedBy: actor, createdBy: actor, projectId: projectUuid ?? null } as any)), { transaction });
  }

  private toPublic(row: CrmInternalTask, relations: { projects: Map<string, any>; users: Map<string, SysUser> }) {
    const data = row.toJSON() as Record<string, any>;
    const progressByStatus: Record<string, number> = {
      Todo: 0, Pending: 0, 'In Progress': 40, Testing: 80, Review: 90,
      'Under Review': 90, Completed: 100, Delayed: 40, Cancelled: 0,
    };
    const assignees = (data.assignees ?? []).map((item: any) => ({
      id: item.userId,
      userCode: relations.users.get(item.userId)?.userCode ?? null,
      uuid: relations.users.get(item.userId)?.uuid ?? null,
      name: relations.users.get(item.userId)?.name ?? null,
      assignmentUuid: item.uuid,
      status: item.status,
    }));
    return {
      uuid: data.uuid,
      title: data.title,
      description: data.description ?? null,
      projectCode: data.projectId ?? null,
      project: data.projectId ? relations.projects.get(data.projectId) ?? null : null,
      taskTypeUuid: data.taskType?.uuid ?? null,
      taskType: data.taskType ? { uuid: data.taskType.uuid, name: data.taskType.name, code: data.taskType.code } : null,
      relatedLeadUuid: data.lead?.uuid ?? null,
      lead: data.lead ? { uuid: data.lead.uuid, leadCode: data.lead.leadCode, clientName: data.lead.clientName } : null,
      assignedTo: assignees,
      priority: this.displayStatus(data.priority),
      status: this.displayStatus(data.status),
      progress: progressByStatus[this.displayStatus(data.status)] ?? 0,
      startDate: data.createdAt ?? null,
      dueDate: data.dueDate ?? null,
      createdBy: data.createdBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private displayStatus(value?: string | null) {
    return value ? value.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase()) : value;
  }
}
