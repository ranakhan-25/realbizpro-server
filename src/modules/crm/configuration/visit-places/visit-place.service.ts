import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadVisitPlace } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { CreateVisitPlaceDto } from './dto/create-visit-place.dto';
import { QueryVisitPlaceDto } from './dto/query-visit-place.dto';
import { UpdateVisitPlaceDto } from './dto/update-visit-place.dto';

const PUBLIC_COLUMNS = ['uuid', 'name', 'address', 'contactPerson', 'contactNumber', 'orgId', 'createdBy', 'updatedBy', 'deletedBy', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class VisitPlaceService {
  constructor(
    @InjectModel(LeadVisitPlace) private readonly places: typeof LeadVisitPlace,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
  ) {}

  async create(dto: CreateVisitPlaceDto, userId?: number, currentUser?: any) {
    const name = dto.name.trim();
    const orgId = dto.orgId ?? currentUser?.orgId ?? null;
    await this.assertUniqueName(name, undefined, orgId);
    const row = await this.places.create({
      name,
      createdBy: userId ? String(userId) : null,
      orgId,
      ...(dto.address !== undefined ? { address: dto.address.trim() || null } : {}),
      ...(dto.contactPerson !== undefined ? { contactPerson: dto.contactPerson.trim() || null } : {}),
      ...(dto.contactNumber !== undefined ? { contactNumber: dto.contactNumber.trim() || null } : {}),
    } as any);
    return this.findOne(row.uuid, currentUser);
  }

  async findAll(query: QueryVisitPlaceDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.places.findAndCountAll({
      attributes: PUBLIC_COLUMNS,
      where, limit, offset: (page - 1) * limit, order: [['name', 'ASC']], paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublic(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.places.findOne({
      where, attributes: PUBLIC_COLUMNS,
      include: [{ association: 'activities', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    const result: Record<string, any> = this.toPublic(row);
    result.activities = (row.activities ?? []).map(activity => ({ uuid: activity.uuid }));
    return result;
  }

  async update(uuid: string, dto: UpdateVisitPlaceDto, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.places.findOne({ where });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    const changes: Record<string, any> = {};
    const orgId = dto.orgId ?? row.orgId ?? currentUser?.orgId ?? null;
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid, orgId);
    }
    if (dto.address !== undefined) changes.address = dto.address.trim() || null;
    if (dto.contactPerson !== undefined) changes.contactPerson = dto.contactPerson.trim() || null;
    if (dto.contactNumber !== undefined) changes.contactNumber = dto.contactNumber.trim() || null;
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
    const row = await this.places.findOne({ where });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    if (userId) await row.update({ deletedBy: String(userId) });
    await row.destroy({ force: false });
    return { message: `Visit place ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.places.findOne({ where, paranoid: false });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Visit place ${uuid} is not deleted`);
    if (userId) await row.update({ updatedBy: String(userId) });
    await row.restore();
    return this.findOne(uuid, currentUser);
  }

  async dropdown(currentUser?: any) {
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const rows = await this.places.findAll({ where, attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string, orgId?: number | null) {
    const where: any = { name: { [Op.iLike]: name } };
    if (excludeUuid) where.uuid = { [Op.ne]: excludeUuid };
    if (orgId) where.orgId = orgId;
    const existing = await this.places.findOne({
      where,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Visit place '${name}' already exists`);
  }

  private toPublic(row: LeadVisitPlace) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid,
      name: data.name,
      orgId: data.org_id ?? data.orgId ?? null,
      org_id: data.org_id ?? data.orgId ?? null,
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.contactPerson !== undefined ? { contactPerson: data.contactPerson } : {}),
      ...(data.contactNumber !== undefined ? { contactNumber: data.contactNumber } : {}),
      created_by: data.created_by ?? data.createdBy ?? null,
      updated_by: data.updated_by ?? data.updatedBy ?? null,
      deleted_by: data.deleted_by ?? data.deletedBy ?? null,
      created_at: data.created_at ?? data.createdAt,
      updated_at: data.updated_at ?? data.updatedAt,
      ...(data.deleted_at || data.deletedAt ? { deleted_at: data.deleted_at ?? data.deletedAt } : {}),
    };
  }
}
