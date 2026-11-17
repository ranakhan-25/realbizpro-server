import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvStockCount } from '../../../database/models/inventory/stock-count.model';
import { CreateStockCountDto } from './dto/create-stock-count.dto';
import { UpdateStockCountDto } from './dto/update-stock-count.dto';

@Injectable()
export class StockCountService {
  constructor(
    @InjectModel(InvStockCount)
    private readonly stockCountModel: typeof InvStockCount,
  ) {}

  async create(createDto: CreateStockCountDto): Promise<InvStockCount> {
    return await this.stockCountModel.create(createDto as any);
  }

  async findAll(filter?: { warehouse_id?: number; org_id?: string }): Promise<InvStockCount[]> {
    const where: any = {};
    if (filter?.warehouse_id) where.warehouse_id = filter.warehouse_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.stockCountModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(idOrUuid: string): Promise<InvStockCount> {
    const isNum = !isNaN(Number(idOrUuid));
    const where: any = isNum ? { id: Number(idOrUuid) } : { uuid: idOrUuid };
    const record = await this.stockCountModel.findOne({ where });
    if (!record) throw new NotFoundException('Stock count record not found');
    return record;
  }

  async update(idOrUuid: string, updateDto: UpdateStockCountDto): Promise<InvStockCount> {
    const record = await this.findOne(idOrUuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(idOrUuid: string): Promise<void> {
    const record = await this.findOne(idOrUuid);
    await record.destroy();
  }
}
