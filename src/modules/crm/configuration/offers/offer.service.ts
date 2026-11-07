import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmOffer } from 'src/database/models/crm/configuration/crm-offer.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CreateOfferDto, OfferStatus } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(CrmOffer) private readonly offers: typeof CrmOffer,
    @InjectModel(Lead) private readonly leads: typeof Lead,
  ) {}

  async create(dto: CreateOfferDto, userId?: number, currentUser?: any) {
    const row = await this.offers.create({
      ...dto,
      name: dto.name.trim(),
      status: dto.status ?? OfferStatus.ACTIVE,
      createdBy: userId ? String(userId) : dto.createdBy ?? null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryOfferDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.status) where.status = query.status;
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const { rows, count } = await this.offers.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
      paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicOffer(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.offers.findOne({
      where,
      include: [{ association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false }],
    });
    if (!row) throw new NotFoundException(`Offer ${uuid} not found`);
    return this.toPublicOffer(row);
  }

  async update(uuid: string, dto: UpdateOfferDto, userId?: number, currentUser?: any) {
    const row = await this.offers.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Offer ${uuid} not found`);
    await row.update({
      ...dto,
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      updatedBy: userId ? String(userId) : row.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
    } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.offers.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Offer ${uuid} not found`);
    await row.update({ deletedBy: userId ? String(userId) : null } as any);
    await row.destroy({ force: false });
    return { message: `Offer ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.offers.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Offer ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Offer ${uuid} is not deleted`);
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : row.updatedBy ?? null } as any);
    return this.findOne(uuid);
  }

  async dropdown(currentUser?: any) {
    const where: any = { status: OfferStatus.ACTIVE };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const rows = await this.offers.findAll({
      where, attributes: ['uuid', 'name'], order: [['name', 'ASC']],
    });
    return rows.map(row => {
      const result = row.toJSON() as Record<string, any>;
      delete result.id;
      return result;
    });
  }

  statusDropdown() {
    return [
      { value: OfferStatus.ACTIVE, label: 'Active' },
      { value: OfferStatus.INACTIVE, label: 'Inactive' },
    ];
  }

  private toPublicOffer(row: CrmOffer) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.created_at = data.created_at ?? data.createdAt;
    data.updated_at = data.updated_at ?? data.updatedAt;
    data.deleted_at = data.deleted_at ?? data.deletedAt ?? null;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    data.created_by = data.createdBy ?? data.created_by ?? null;
    data.updated_by = data.updatedBy ?? data.updated_by ?? null;
    data.deleted_by = data.deletedBy ?? data.deleted_by ?? null;
    delete data.addedBy;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.deletedBy;
    delete data.projectId;
    if (Array.isArray(data.leads)) {
      data.leads = data.leads.map((lead: Record<string, any>) => ({ uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName }));
    }
    return data;
  }
}
