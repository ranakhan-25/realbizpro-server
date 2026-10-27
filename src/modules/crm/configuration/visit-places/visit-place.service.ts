import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadVisitPlace } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { CreateVisitPlaceDto } from './dto/create-visit-place.dto';
import { QueryVisitPlaceDto } from './dto/query-visit-place.dto';
import { UpdateVisitPlaceDto } from './dto/update-visit-place.dto';

const PUBLIC_COLUMNS = ['uuid', 'name', 'address', 'contactPerson', 'contactNumber', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class VisitPlaceService {
  constructor(
    @InjectModel(LeadVisitPlace) private readonly places: typeof LeadVisitPlace,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
  ) {}

  async create(dto: CreateVisitPlaceDto, createdBy?: string) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.places.create({
      name, createdBy,
      ...(dto.address !== undefined ? { address: dto.address.trim() || null } : {}),
      ...(dto.contactPerson !== undefined ? { contactPerson: dto.contactPerson.trim() || null } : {}),
      ...(dto.contactNumber !== undefined ? { contactNumber: dto.contactNumber.trim() || null } : {}),
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryVisitPlaceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
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

  async findOne(uuid: string) {
    const row = await this.places.findOne({
      where: { uuid }, attributes: PUBLIC_COLUMNS,
      include: [{ association: 'activities', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    const result: Record<string, any> = this.toPublic(row);
    result.activities = (row.activities ?? []).map(activity => ({ uuid: activity.uuid }));
    return result;
  }

  async update(uuid: string, dto: UpdateVisitPlaceDto, updatedBy?: string) {
    const row = await this.places.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    const changes: Record<string, any> = {};
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    if (dto.address !== undefined) changes.address = dto.address.trim() || null;
    if (dto.contactPerson !== undefined) changes.contactPerson = dto.contactPerson.trim() || null;
    if (dto.contactNumber !== undefined) changes.contactNumber = dto.contactNumber.trim() || null;
    if (updatedBy) changes.updatedBy = updatedBy;
    await row.update(changes);
    return this.findOne(uuid);
  }

  async remove(uuid: string, deletedBy?: string) {
    const row = await this.places.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    if (deletedBy) await row.update({ deletedBy });
    await row.destroy({ force: false });
    return { message: `Visit place ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.places.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Visit place ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Visit place ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.places.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string) {
    const existing = await this.places.findOne({
      where: { name: { [Op.iLike]: name }, ...(excludeUuid ? { uuid: { [Op.ne]: excludeUuid } } : {}) } as any,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Visit place '${name}' already exists`);
  }

  private toPublic(row: LeadVisitPlace) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid,
      name: data.name,
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.contactPerson !== undefined ? { contactPerson: data.contactPerson } : {}),
      ...(data.contactNumber !== undefined ? { contactNumber: data.contactNumber } : {}),
      createdBy: data.createdBy ?? null,
      ...(data.createdAt !== undefined ? { createdAt: data.createdAt } : {}),
      ...(data.updatedAt !== undefined ? { updatedAt: data.updatedAt } : {}),
      ...(data.deletedAt !== undefined ? { deletedAt: data.deletedAt } : {}),
    };
  }
}
