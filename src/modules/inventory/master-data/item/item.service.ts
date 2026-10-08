import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvItem } from '../../../../database/models/inventory/inv_item.model';
import { CreateInvItemDto } from './dto/create-inv-item.dto';
import { UpdateInvItemDto } from './dto/update-inv-item.dto';
import { InvCategory } from '../../../../database/models/inventory/inv_category.model';
import { InvSubCategory } from '../../../../database/models/inventory/inv_sub_category.model';
import { InvBrand } from '../../../../database/models/inventory/inv_brand.model';
import { InvUnit } from '../../../../database/models/inventory/inv_unit.model';

@Injectable()
export class InvItemService {
  constructor(
    @InjectModel(InvItem)
    private readonly itemModel: typeof InvItem,
  ) {}

  async create(createDto: CreateInvItemDto): Promise<InvItem> {
    try {
      return await this.itemModel.create(createDto as any);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Item with this code already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<InvItem[]> {
    return await this.itemModel.findAll({
      include: [
        { model: InvCategory },
        { model: InvSubCategory },
        { model: InvBrand },
        { model: InvUnit },
      ],
    });
  }

  async findOne(uuid: string): Promise<InvItem> {
    const item = await this.itemModel.findByPk(uuid, {
      include: [
        { model: InvCategory },
        { model: InvSubCategory },
        { model: InvBrand },
        { model: InvUnit },
      ],
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(uuid: string, updateDto: UpdateInvItemDto): Promise<InvItem> {
    const item = await this.findOne(uuid);
    await item.update(updateDto as any);
    return item;
  }

  async remove(uuid: string): Promise<void> {
    const item = await this.findOne(uuid);
    // TODO: Prevent deletion if used in purchases/material usage
    await item.destroy();
  }
}
