import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { QueryVisitStatusDto } from './dto/query-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';

const COLUMNS = ['uuid', 'name', 'color', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class VisitStatusService {
  constructor(
    @InjectModel(LeadVisitStatus) private readonly statuses: typeof LeadVisitStatus,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
  ) {}

  async create(dto: CreateVisitStatusDto, createdBy?: string) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.statuses.create({ name, color: dto.color?.trim() || null, createdBy } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryVisitStatusDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const { rows, count } = await this.statuses.findAndCountAll({
      attributes: COLUMNS, where, limit, offset: (page - 1) * limit,
      order: [['name', 'ASC']], paranoid: !query.withDeleted,
    });
    return { data: rows.map(row => this.toPublic(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string) {
    const row = await this.statuses.findOne({
      where: { uuid }, attributes: COLUMNS,
      include: [{ association: 'activities', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    return { ...this.toPublic(row), activities: (row.activities ?? []).map(activity => ({ uuid: activity.uuid })) };
  }

  async update(uuid: string, dto: UpdateVisitStatusDto, updatedBy?: string) {
    const row = await this.statuses.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    const changes: Record<string, any> = {};
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    if (dto.color !== undefined) changes.color = dto.color.trim() || null;
    if (updatedBy) changes.updatedBy = updatedBy;
    await row.update(changes);
    return this.findOne(uuid);
  }

  async remove(uuid: string, deletedBy?: string) {
    const row = await this.statuses.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    if (deletedBy) await row.update({ deletedBy });
    await row.destroy({ force: false });
    return { message: `Visit status ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.statuses.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Visit status ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.statuses.findAll({ attributes: ['uuid', 'name', 'color'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string) {
    const existing = await this.statuses.findOne({
      where: { name: { [Op.iLike]: name }, ...(excludeUuid ? { uuid: { [Op.ne]: excludeUuid } } : {}) } as any,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Visit status '${name}' already exists`);
  }

  private toPublic(row: LeadVisitStatus) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid, name: data.name, color: data.color ?? null, createdBy: data.createdBy ?? null,
      createdAt: data.createdAt, updatedAt: data.updatedAt, ...(data.deletedAt ? { deletedAt: data.deletedAt } : {}),
    };
  }
}
