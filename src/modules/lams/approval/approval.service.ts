import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsApproval } from '../../../database/models/lams/approval.model';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectModel(LamsApproval)
    private readonly approvalModel: typeof LamsApproval,
  ) {}

  async create(createDto: CreateApprovalDto): Promise<LamsApproval> {
    return await this.approvalModel.create(createDto as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsApproval[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.approvalModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<LamsApproval> {
    const record = await this.approvalModel.findOne({
      where: { uuid },
    });
    if (!record) throw new NotFoundException('Approval record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateApprovalDto): Promise<LamsApproval> {
    const record = await this.findOne(uuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(uuid: string): Promise<void> {
    const record = await this.findOne(uuid);
    await record.destroy();
  }
}
