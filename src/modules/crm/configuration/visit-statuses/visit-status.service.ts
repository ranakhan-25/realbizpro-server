import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { QueryVisitStatusDto } from './dto/query-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';

const COLUMNS = ['uuid', 'name', 'color', 'orgId', 'createdBy', 'updatedBy', 'deletedBy', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class VisitStatusService {
  constructor(
    @InjectModel(LeadVisitStatus) private readonly statuses: typeof LeadVisitStatus,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
  ) {}

  async create(dto: CreateVisitStatusDto, userId?: number, currentUser?: any) {
    const name = dto.name.trim();
    const orgId = dto.orgId ?? currentUser?.orgId ?? null;
    await this.assertUniqueName(name, undefined, orgId);
    const row = await this.statuses.create({
      name,
      color: dto.color?.trim() || null,
      createdBy: userId ? String(userId) : null,
      orgId,
    } as any);
    return this.findOne(row.uuid, currentUser);
  }

  async findAll(query: QueryVisitStatusDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const { rows, count } = await this.statuses.findAndCountAll({
      attributes: COLUMNS, where, limit, offset: (page - 1) * limit,
      order: [['name', 'ASC']], paranoid: !query.withDeleted,
    });
    return { data: rows.map(row => this.toPublic(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.statuses.findOne({
      where, attributes: COLUMNS,
      include: [{ association: 'activities', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    return { ...this.toPublic(row), activities: (row.activities ?? []).map(activity => ({ uuid: activity.uuid })) };
  }

  async update(uuid: string, dto: UpdateVisitStatusDto, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.statuses.findOne({ where });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    const changes: Record<string, any> = {};
    const orgId = dto.orgId ?? row.orgId ?? currentUser?.orgId ?? null;
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid, orgId);
    }
    if (dto.color !== undefined) changes.color = dto.color.trim() || null;
    if (userId) changes.updatedBy = String(userId);
    if (dto.orgId !== undefined) changes.orgId = dto.orgId;
    await row.update(changes);
    return this.findOne(uuid, currentUser);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.statuses.findOne({ where });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    if (userId) await row.update({ deletedBy: String(userId) });
    await row.destroy({ force: false });
    return { message: `Visit status ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.statuses.findOne({ where, paranoid: false });
    if (!row) throw new NotFoundException(`Visit status ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Visit status ${uuid} is not deleted`);
    if (userId) await row.update({ updatedBy: String(userId) });
    await row.restore();
    return this.findOne(uuid, currentUser);
  }

  async dropdown(currentUser?: any) {
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const rows = await this.statuses.findAll({ where, attributes: ['uuid', 'name', 'color'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string, orgId?: number | null) {
    const where: any = { name: { [Op.iLike]: name } };
    if (excludeUuid) where.uuid = { [Op.ne]: excludeUuid };
    if (orgId) where.orgId = orgId;
    const existing = await this.statuses.findOne({
      where,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Visit status '${name}' already exists`);
  }

  private toPublic(row: LeadVisitStatus) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid,
      name: data.name,
      color: data.color ?? null,
      orgId: data.org_id ?? data.orgId ?? null,
      org_id: data.org_id ?? data.orgId ?? null,
      created_by: data.created_by ?? data.createdBy ?? null,
      updated_by: data.updated_by ?? data.updatedBy ?? null,
      deleted_by: data.deleted_by ?? data.deletedBy ?? null,
      created_at: data.created_at ?? data.createdAt,
      updated_at: data.updated_at ?? data.updatedAt,
      ...(data.deleted_at || data.deletedAt ? { deleted_at: data.deleted_at ?? data.deletedAt } : {}),
    };
  }
}
