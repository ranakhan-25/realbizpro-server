import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvStockIssue } from '../../../database/models/inventory/stock-issue.model';
import { CreateStockIssueDto } from './dto/create-stock-issue.dto';
import { UpdateStockIssueDto } from './dto/update-stock-issue.dto';

@Injectable()
export class StockIssueService {
  constructor(
    @InjectModel(InvStockIssue)
    private readonly stockIssueModel: typeof InvStockIssue,
  ) {}

  async create(createDto: CreateStockIssueDto): Promise<InvStockIssue> {
    return await this.stockIssueModel.create(createDto as any);
  }

  async findAll(filter?: { warehouse_id?: number; item_id?: string; org_id?: string }): Promise<InvStockIssue[]> {
    const where: any = {};
    if (filter?.warehouse_id) where.warehouse_id = filter.warehouse_id;
    if (filter?.item_id) where.item_id = filter.item_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.stockIssueModel.findAll({
      where,
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });
  }

  async findOne(idOrUuid: string): Promise<InvStockIssue> {
    const isNum = !isNaN(Number(idOrUuid));
    const where: any = isNum ? { id: Number(idOrUuid) } : { uuid: idOrUuid };
    const record = await this.stockIssueModel.findOne({ where });
    if (!record) throw new NotFoundException('Stock issue record not found');
    return record;
  }

  async update(idOrUuid: string, updateDto: UpdateStockIssueDto): Promise<InvStockIssue> {
    const record = await this.findOne(idOrUuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(idOrUuid: string): Promise<void> {
    const record = await this.findOne(idOrUuid);
    await record.destroy();
  }
}
