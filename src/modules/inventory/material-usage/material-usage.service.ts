import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InvMaterialUsage } from 'src/database/models/inventory/inv_material_usage.model';
import { InvMaterialUsageItem } from 'src/database/models/inventory/inv_material_usage_item.model';
import { CreateInvMaterialUsageDto } from './dto/create-inv-material-usage.dto';
import { UpdateInvMaterialUsageDto } from './dto/update-inv-material-usage.dto';
import { QueryInvMaterialUsageDto } from './dto/query-inv-material-usage.dto';

@Injectable()
export class MaterialUsageService {
  constructor(
    @InjectModel(InvMaterialUsage) private readonly usageModel: typeof InvMaterialUsage,
    @InjectModel(InvMaterialUsageItem) private readonly usageItemModel: typeof InvMaterialUsageItem,
    private sequelize: Sequelize,
  ) {}

  async create(createDto: CreateInvMaterialUsageDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const usage = await this.usageModel.create(
        {
          date: new Date(createDto.date),
          note: createDto.note,
          company_id: createDto.company_id,
          project_id: createDto.project_id,
          site_id: createDto.site_id,
          task_id: createDto.task_id,
          worker_id: createDto.worker_id,
          createdBy: createDto.createdBy,
        },
        { transaction },
      );

      const itemsToInsert = createDto.items.map(item => ({
        ...item,
        usage_id: usage.id,
        createdBy: createDto.createdBy,
      }));

      await this.usageItemModel.bulkCreate(itemsToInsert, { transaction });

      await transaction.commit();
      return this.findOne(usage.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: QueryInvMaterialUsageDto) {
    const { page = 1, limit = 10, project_id } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (project_id) where.project_id = project_id;

    const { rows, count } = await this.usageModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: this.usageItemModel, as: 'items', required: false }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string) {
    const usage = await this.usageModel.findByPk(id, {
      include: [{ model: this.usageItemModel, as: 'items', required: false }],
    });
    if (!usage) throw new NotFoundException(`Material Usage #${id} not found`);
    return usage;
  }

  async update(id: string, updateDto: UpdateInvMaterialUsageDto) {
    const usage = await this.findOne(id);
    const { items, ...headerData } = updateDto;
    await usage.update({
      ...headerData,
      date: updateDto.date ? new Date(updateDto.date) : usage.date,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const usage = await this.findOne(id);
    await usage.destroy();
    return { message: 'Material Usage deleted successfully' };
  }
}
