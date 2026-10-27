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

  async create(dto: CreateCommunicationStatusDto): Promise<CommunicationStatus> {
    if (dto.leadStageId) await this.ensureActiveLeadStage(dto.leadStageId);
    const row = await this.statusModel.create(dto as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryCommunicationStatusDto) {
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
    const { rows, count } = await this.statusModel.findAndCountAll({
      where, limit, offset, order: [[sortBy, sortOrder]], paranoid: !withDeleted,
      include: [{ association: 'leadStage', required: false }],
    });
    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage = skip !== undefined ? Math.floor(offset / limit) + 1 : page;
    return {
      data: rows,
      meta: {
        page: currentPage, pageNo: currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
        limit, skip: offset, total: count, totalPages,
      },
    };
  }

  async findOne(uuid: string): Promise<CommunicationStatus> {
    const row = await this.statusModel.findOne({
      where: { uuid } as any,
      include: [{ association: 'leadStage', required: false, paranoid: false }],
    });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdateCommunicationStatusDto): Promise<CommunicationStatus> {
    const row = await this.statusModel.findOne({ where: { uuid } as any });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    if (dto.leadStageId) await this.ensureActiveLeadStage(dto.leadStageId);
    await row.update(dto as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const row = await this.statusModel.findOne({ where: { uuid } as any });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    await row.destroy({ force: false });
    return { message: `Communication status #${uuid} deleted successfully` };
  }

  async restore(uuid: string): Promise<CommunicationStatus> {
    const row = await this.statusModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!row) throw new NotFoundException(`Communication status #${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Communication status #${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    return this.statusModel.findAll({
      where: { status: CommunicationStatusState.ACTIVE },
      attributes: ['uuid', 'name', 'isDefault', 'leadStageId'],
      order: [['name', 'ASC']],
    });
  }

  async leadStageDropdown() {
    return this.leadStageModel.findAll({
      where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']],
    });
  }

  private async ensureActiveLeadStage(uuid: string): Promise<void> {
    const row = await this.leadStageModel.findOne({ where: { uuid, isActive: true } as any });
    if (!row) throw new BadRequestException(`Active lead stage #${uuid} not found`);
  }
}
