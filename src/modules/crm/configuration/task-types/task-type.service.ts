import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TaskType } from 'src/database/models/crm/configuration/crm-task-type.model';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { QueryTaskTypeDto } from './dto/query-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';

const COLUMNS = ['uuid', 'name', 'code', 'createdBy', 'updatedBy', 'deletedBy', 'createdAt', 'updatedAt', 'deletedAt', 'orgId'];

@Injectable()
export class TaskTypeService {
  constructor(
    @InjectModel(TaskType) private readonly taskTypes: typeof TaskType,
  ) {}

  async create(dto: CreateTaskTypeDto, userId?: number, currentUser?: any) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.taskTypes.create({
      name,
      code: dto.code?.trim() || null,
      createdBy: userId ? String(userId) : null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    if (dto.status === 'Inactive') await row.destroy({ force: false });
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryTaskTypeDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
    if (query.status === 'Active') where.deletedAt = { [Op.is]: null };
    if (query.status === 'Inactive') where.deletedAt = { [Op.not]: null };
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const { rows, count } = await this.taskTypes.findAndCountAll({
      attributes: COLUMNS, where, limit, offset: (page - 1) * limit,
      order: [['name', 'ASC']], paranoid: query.status === 'Inactive' ? false : !query.withInactive,
    });
    return { data: rows.map(row => this.toPublic(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.taskTypes.findOne({
      where, paranoid: false, attributes: COLUMNS,
      include: [{ association: 'tasks', attributes: ['uuid', 'title'], required: false }],
    });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    return { ...this.toPublic(row), tasks: (row.tasks ?? []).map(task => ({ uuid: task.uuid, title: task.title })) };
  }

  async update(uuid: string, dto: UpdateTaskTypeDto, userId?: number, currentUser?: any) {
    const row = await this.taskTypes.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    const changes: Record<string, any> = {};
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    if (dto.code !== undefined) changes.code = dto.code.trim() || null;
    if (userId) changes.updatedBy = String(userId);
    if (dto.orgId !== undefined) changes.orgId = dto.orgId;
    if (Object.keys(changes).length) await row.update(changes);
    if (dto.status === 'Inactive' && !row.deletedAt) {
      if (userId) await row.update({ deletedBy: String(userId) });
      await row.destroy({ force: false });
    }
    if (dto.status === 'Active' && row.deletedAt) {
      await row.restore();
      await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : row.updatedBy ?? null });
    }
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.taskTypes.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    await row.update({ deletedBy: userId ? String(userId) : null });
    await row.destroy({ force: false });
    return { message: `Task type ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.taskTypes.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Task type ${uuid} is already active`);
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : row.updatedBy ?? null });
    return this.findOne(uuid);
  }

  async dropdown(currentUser?: any) {
    const where: any = {};
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const rows = await this.taskTypes.findAll({ where, attributes: ['uuid', 'name', 'code'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string) {
    const existing = await this.taskTypes.findOne({
      where: { name: { [Op.iLike]: name }, ...(excludeUuid ? { uuid: { [Op.ne]: excludeUuid } } : {}) } as any,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Task type '${name}' already exists`);
  }

  private toPublic(row: TaskType) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid, name: data.name, code: data.code ?? null,
      status: data.deletedAt || data.deleted_at ? 'Inactive' : 'Active',
      created_by: data.created_by ?? data.createdBy ?? null,
      updated_by: data.updated_by ?? data.updatedBy ?? null,
      deleted_by: data.deleted_by ?? data.deletedBy ?? null,
      created_at: data.created_at ?? data.createdAt, updated_at: data.updated_at ?? data.updatedAt,
      ...(data.deleted_at || data.deletedAt ? { deleted_at: data.deleted_at ?? data.deletedAt } : {}),
    };
  }
}
