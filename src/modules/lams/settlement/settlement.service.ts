import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsSettlement } from '../../../database/models/lams/settlement.model';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';

@Injectable()
export class SettlementService {
  constructor(
    @InjectModel(LamsSettlement)
    private readonly settlementModel: typeof LamsSettlement,
  ) {}

  async create(createDto: CreateSettlementDto): Promise<LamsSettlement> {
    return await this.settlementModel.create(createDto as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsSettlement[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.settlementModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<LamsSettlement> {
    const record = await this.settlementModel.findOne({
      where: { uuid },
    });
    if (!record) throw new NotFoundException('Settlement record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateSettlementDto): Promise<LamsSettlement> {
    const record = await this.findOne(uuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(uuid: string): Promise<void> {
    const record = await this.findOne(uuid);
    await record.destroy();
  }
}
