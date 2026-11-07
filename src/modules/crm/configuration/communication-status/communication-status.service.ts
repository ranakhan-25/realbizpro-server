import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { CreateCommunicationStatusDto } from './dto/create-communication-status.dto';
import { QueryCommunicationStatusDto } from './dto/query-communication-status.dto';
import { UpdateCommunicationStatusDto } from './dto/update-communication-status.dto';

@Injectable()
export class CommunicationStatusService {
  constructor(
    @InjectModel(CommunicationStatus) private readonly statusModel: typeof CommunicationStatus,
    @InjectModel(LeadStage) private readonly leadStageModel: typeof LeadStage,
  ) {}

  async create(dto: CreateCommunicationStatusDto, userId?: number, currentUser?: any): Promise<CommunicationStatus> {
    if (dto.leadStageId) await this.ensureActiveLeadStage(dto.leadStageId);
    const row = await this.statusModel.create({
      ...dto,
      createdBy: userId ? String(userId) : dto.addedById ?? null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryCommunicationStatusDto, currentUser?: any) {
    const { page = 1, limit = 10, skip, search, status, leadStageId, isDefault, sortBy = 'createdAt', sortOrder = 'DESC', withDeleted = false } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
    if (status) where.status = status;
    if (leadStageId) where.leadStageId = leadStageId;
    if (isDefault !== undefined) where.isDefault = isDefault;
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const { rows, count } = await this.statusModel.findAndCountAll({
      where, limit, offset, order: [[sortBy, sortOrder]], paranoid: !withDeleted,
      include: [{ association: 'leadStage', required: false }],
    });
    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage = skip !== undefined ? Math.floor(offset / limit) + 1 : page;
    const mappedRows = rows.map(r => {
      const item = r.toJSON() as any;
      item.created_at = item.created_at ?? item.createdAt;
      item.updated_at = item.updated_at ?? item.updatedAt;
      item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
      delete item.createdAt;
      delete item.updatedAt;
      delete item.deletedAt;
      item.created_by = item.createdBy ?? item.addedById ?? item.created_by ?? null;
      item.updated_by = item.updatedBy ?? item.updated_by ?? null;
      item.deleted_by = item.deletedBy ?? item.deleted_by ?? null;
      delete item.addedById;
      return item;
    });
    return {
      data: mappedRows,
      meta: {
        page: currentPage, pageNo: currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
        limit, skip: offset, total: count, totalPages,
      },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<any> {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.statusModel.findOne({
      where,
      include: [{ association: 'leadStage', required: false, paranoid: false }],
    });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    const item = row.toJSON() as any;
    item.created_at = item.created_at ?? item.createdAt;
    item.updated_at = item.updated_at ?? item.updatedAt;
    item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.deletedAt;
    item.created_by = item.createdBy ?? item.addedById ?? item.created_by ?? null;
    item.updated_by = item.updatedBy ?? item.updated_by ?? null;
    item.deleted_by = item.deletedBy ?? item.deleted_by ?? null;
    delete item.addedById;
    return item;
  }

  async update(uuid: string, dto: UpdateCommunicationStatusDto, userId?: number, currentUser?: any): Promise<CommunicationStatus> {
    const row = await this.statusModel.findOne({ where: { uuid } as any });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    if (dto.leadStageId) await this.ensureActiveLeadStage(dto.leadStageId);
    await row.update({
      ...dto,
      updatedBy: userId ? String(userId) : (row as any).updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
    } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const row = await this.statusModel.findOne({ where: { uuid } as any });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    await row.update({ deletedBy: userId ? String(userId) : null } as any);
    await row.destroy({ force: false });
    return { message: `Communication status #${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<CommunicationStatus> {
    const row = await this.statusModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Communication status #${uuid} is not deleted`);
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : (row as any).updatedBy ?? null } as any);
    return this.findOne(uuid);
  }

  async dropdown(currentUser?: any) {
    const where: any = { status: CommunicationStatusState.ACTIVE };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    return this.statusModel.findAll({
      where,
      attributes: ['uuid', 'name', 'isDefault', 'leadStageId'],
      order: [['name', 'ASC']],
    });
  }

  async leadStageDropdown(currentUser?: any) {
    const where: any = { isActive: true };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    return this.leadStageModel.findAll({
      where, attributes: ['uuid', 'name'], order: [['name', 'ASC']],
    });
  }

  private async ensureActiveLeadStage(uuid: string): Promise<void> {
    const row = await this.leadStageModel.findOne({ where: { uuid, isActive: true } as any });
    if (!row) throw new BadRequestException(`Active lead stage #${uuid} not found`);
  }
}
