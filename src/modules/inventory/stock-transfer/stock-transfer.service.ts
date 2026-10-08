import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { InvStockTransfer } from 'src/database/models/inventory/inv_stock_transfer.model';
import { InvItem } from 'src/database/models/inventory/inv_item.model';
import { CreateInvStockTransferDto } from './dto/create-inv-stock-transfer.dto';
import { UpdateInvStockTransferDto } from './dto/update-inv-stock-transfer.dto';
import { QueryInvStockTransferDto } from './dto/query-inv-stock-transfer.dto';

@Injectable()
export class StockTransferService {
  constructor(
    @InjectModel(InvStockTransfer) private readonly transferModel: typeof InvStockTransfer,
    @InjectModel(InvItem) private readonly itemModel: typeof InvItem,
  ) {}

  async create(createDto: CreateInvStockTransferDto) {
    const transfer = await this.transferModel.create({
      ...createDto,
      date: new Date(createDto.date),
    });
    return this.findOne(transfer.id);
  }

  async findAll(query: QueryInvStockTransferDto) {
    const { page = 1, limit = 10, project_id } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (project_id) {
      where[Op.or] = [{ from_project_id: project_id }, { to_project_id: project_id }];
    }

    const { rows, count } = await this.transferModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: this.itemModel, as: 'item', required: false }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string) {
    const transfer = await this.transferModel.findByPk(id, {
      include: [{ model: this.itemModel, as: 'item', required: false }],
    });
    if (!transfer) throw new NotFoundException(`Stock Transfer #${id} not found`);
    return transfer;
  }

  async update(id: string, updateDto: UpdateInvStockTransferDto) {
    const transfer = await this.findOne(id);
    await transfer.update({
      ...updateDto,
      date: updateDto.date ? new Date(updateDto.date) : transfer.date,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const transfer = await this.findOne(id);
    await transfer.destroy();
    return { message: 'Stock Transfer deleted successfully' };
  }
}
