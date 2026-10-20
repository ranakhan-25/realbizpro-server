import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import {
  CreateCrmNegotiationDto,
  UpdateCrmNegotiationDto,
  ApproveCrmNegotiationDto,
} from './dto/create-crm-negotiation.dto';

@Injectable()
export class CrmNegotiationsService {
  constructor(
    @InjectModel(CrmDealNegotiation)
    private readonly negotiationModel: typeof CrmDealNegotiation,
    @InjectModel(CrmLead)
    private readonly leadModel: typeof CrmLead,
  ) {}

  async create(createDto: CreateCrmNegotiationDto) {
    return await this.negotiationModel.create(createDto as any);
  }

  async findAll() {
    return await this.negotiationModel.findAll({
      include: [{ model: this.leadModel, as: 'lead' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(uuid: string) {
    const item = await this.negotiationModel.findOne({
      where: { uuid },
      include: [{ model: this.leadModel, as: 'lead' }],
    });
    if (!item) throw new NotFoundException('Negotiation not found');
    return item;
  }

  async update(uuid: string, updateDto: UpdateCrmNegotiationDto) {
    const item = await this.findOne(uuid);
    await item.update(updateDto as any);
    return item;
  }

  async approve(uuid: string, dto: ApproveCrmNegotiationDto) {
    const item = await this.findOne(uuid);
    await item.update({
      approval_status: dto.approval_status,
      approved_by: dto.approved_by,
      approval_date: new Date(),
      rejection_reason: dto.rejection_reason,
    });
    return item;
  }

  async remove(uuid: string) {
    const item = await this.findOne(uuid);
    await item.destroy();
    return { success: true, message: 'Negotiation deleted' };
  }
}
