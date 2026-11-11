import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvWarehouse } from '../../../database/models/inventory/warehouse.model';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(InvWarehouse)
    private readonly warehouseModel: typeof InvWarehouse,
  ) {}

  async create(createDto: CreateWarehouseDto): Promise<InvWarehouse> {
    return await this.warehouseModel.create(createDto as any);
  }

  async findAll(filter?: { org_id?: string; is_active?: boolean }): Promise<InvWarehouse[]> {
    const where: any = {};
    if (filter?.org_id) where.org_id = filter.org_id;
    if (filter?.is_active !== undefined) where.is_active = filter.is_active;
    return await this.warehouseModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findOne(idOrUuid: string): Promise<InvWarehouse> {
    const isNum = !isNaN(Number(idOrUuid));
    const where: any = isNum ? { id: Number(idOrUuid) } : { uuid: idOrUuid };
    const record = await this.warehouseModel.findOne({ where });
    if (!record) throw new NotFoundException('Warehouse not found');
    return record;
  }

  async update(idOrUuid: string, updateDto: UpdateWarehouseDto): Promise<InvWarehouse> {
    const record = await this.findOne(idOrUuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(idOrUuid: string): Promise<void> {
    const record = await this.findOne(idOrUuid);
    await record.destroy();
  }
}
