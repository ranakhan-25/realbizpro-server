import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TaskType } from 'src/database/models/crm/configuration/crm-task-type.model';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { QueryTaskTypeDto } from './dto/query-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';

const COLUMNS = ['uuid', 'name', 'code', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class TaskTypeService {
  constructor(
    @InjectModel(TaskType) private readonly taskTypes: typeof TaskType,
  ) {}

  async create(dto: CreateTaskTypeDto, createdBy?: string) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.taskTypes.create({ name, code: dto.code?.trim() || null, createdBy } as any);
    if (dto.status === 'Inactive') await row.destroy();
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryTaskTypeDto) {
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
    const { rows, count } = await this.taskTypes.findAndCountAll({
      attributes: COLUMNS, where, limit, offset: (page - 1) * limit,
      order: [['name', 'ASC']], paranoid: query.status === 'Inactive' ? false : !query.withInactive,
    });
    return { data: rows.map(row => this.toPublic(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string) {
    const row = await this.taskTypes.findOne({
      where: { uuid }, paranoid: false, attributes: COLUMNS,
      include: [{ association: 'tasks', attributes: ['uuid', 'title'], required: false }],
    });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    return { ...this.toPublic(row), tasks: (row.tasks ?? []).map(task => ({ uuid: task.uuid, title: task.title })) };
  }

  async update(uuid: string, dto: UpdateTaskTypeDto, updatedBy?: string) {
    const row = await this.taskTypes.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    const changes: Record<string, any> = {};
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    if (dto.code !== undefined) changes.code = dto.code.trim() || null;
    if (updatedBy) changes.updatedBy = updatedBy;
    if (Object.keys(changes).length) await row.update(changes);
    if (dto.status === 'Inactive' && !row.deletedAt) await row.destroy();
    if (dto.status === 'Active' && row.deletedAt) await row.restore();
    return this.findOne(uuid);
  }

  async remove(uuid: string, deletedBy?: string) {
    const row = await this.taskTypes.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    if (deletedBy) await row.update({ deletedBy });
    await row.destroy();
    return { message: `Task type ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.taskTypes.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Task type ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Task type ${uuid} is already active`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.taskTypes.findAll({ attributes: ['uuid', 'name', 'code'], order: [['name', 'ASC']] });
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
      status: data.deletedAt ? 'Inactive' : 'Active', createdBy: data.createdBy ?? null,
      createdAt: data.createdAt, updatedAt: data.updatedAt,
      ...(data.deletedAt ? { deletedAt: data.deletedAt } : {}),
    };
  }
}
