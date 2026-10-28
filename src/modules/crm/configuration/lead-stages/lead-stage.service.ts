import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CreateLeadStageDto } from './dto/create-lead-stage.dto';
import { QueryLeadStageDto } from './dto/query-lead-stage.dto';
import { UpdateLeadStageDto } from './dto/update-lead-stage.dto';

@Injectable()
export class LeadStageService {
  constructor(
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
  ) {}

  async create(dto: CreateLeadStageDto) {
    this.ensureSupportedFields(dto);
    const sortOrder = dto.sortBy ?? await this.nextSortOrder();
    const row = await this.stages.create({
      name: dto.name.trim(), isActive: dto.status !== 'inactive', sortOrder,
      ...(dto.color !== undefined ? { color: dto.color } : {}),
      ...(dto.salesProbability !== undefined ? { salesProbability: dto.salesProbability } : {}),
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryLeadStageDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.status) where.isActive = query.status === 'active';
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { color: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.stages.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      paranoid: !query.withDeleted,
    });
    return { data: rows.map(row => this.toPublicStage(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string) {
    const row = await this.stages.findOne({
      where: { uuid },
      include: [
        { association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false },
        { association: 'communicationStatuses', attributes: ['uuid', 'name', 'status'], required: false },
      ],
    });
    if (!row) throw new NotFoundException(`Lead stage ${uuid} not found`);
    const result = this.toPublicStage(row);
    result.leads = (row.leads ?? []).map(lead => ({ uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName }));
    result.communicationStatuses = (row.communicationStatuses ?? []).map(status => ({ uuid: status.uuid, name: status.name, status: status.status }));
    return result;
  }

  async update(uuid: string, dto: UpdateLeadStageDto) {
    this.ensureSupportedFields(dto);
    const row = await this.stages.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead stage ${uuid} not found`);
    const { status, sortBy, ...fields } = dto;
    await row.update({
      ...fields,
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(status !== undefined ? { isActive: status === 'active' } : {}),
      ...(sortBy !== undefined ? { sortOrder: sortBy } : {}),
      ...(dto.salesProbability !== undefined ? { salesProbability: dto.salesProbability } : {}),
    } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.stages.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead stage ${uuid} not found`);
    await row.destroy({ force: false });
    return { message: `Lead stage ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.stages.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Lead stage ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Lead stage ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.stages.findAll({
      where: { isActive: true }, attributes: ['uuid', 'name', 'sortOrder', 'color'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });
    return rows.map(row => {
      const data = row.toJSON() as Record<string, any>;
      delete data.id;
      data.sortBy = data.sortOrder;
      delete data.sortOrder;
      return data;
    });
  }

  statusDropdown() { return [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]; }

  private toPublicStage(row: LeadStage) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.status = data.isActive ? 'active' : 'inactive';
    data.sortBy = data.sortOrder;
    data.description = null;
    data.salesProbability = data.salesProbability == null ? null : Number(data.salesProbability);
    data.addedBy = data.createdBy ?? null;
    delete data.sortOrder;
    delete data.isActive;
    delete data.isSystem;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.deletedBy;
    delete data.projectId;
    return data;
  }

  private async nextSortOrder(): Promise<number> {
    const max = await this.stages.max('sortOrder' as any);
    return Number(max ?? 0) + 1;
  }

  private ensureSupportedFields(dto: CreateLeadStageDto | UpdateLeadStageDto): void {
    if (dto.description !== undefined && dto.description !== '') {
      throw new ConflictException('The crm_lead_stages table has no description column; a schema change is required to save this field');
    }
  }
}
