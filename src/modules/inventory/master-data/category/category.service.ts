import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvCategory } from '../../../../database/models/inventory/inv_category.model';
import { CreateInvCategoryDto } from './dto/create-inv-category.dto';
import { UpdateInvCategoryDto } from './dto/update-inv-category.dto';

@Injectable()
export class InvCategoryService {
  constructor(
    @InjectModel(InvCategory)
    private readonly categoryModel: typeof InvCategory,
  ) {}

  async create(createDto: CreateInvCategoryDto): Promise<InvCategory> {
    try {
      return await this.categoryModel.create(createDto as any);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Category with this code already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<InvCategory[]> {
    return await this.categoryModel.findAll();
  }

  async findOne(uuid: string): Promise<InvCategory> {
    const category = await this.categoryModel.findByPk(uuid);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(uuid: string, updateDto: UpdateInvCategoryDto): Promise<InvCategory> {
    const category = await this.findOne(uuid);
    await category.update(updateDto as any);
    return category;
  }

  async remove(uuid: string): Promise<void> {
    const category = await this.findOne(uuid);
    // TODO: Prevent deletion if used in Items
    await category.destroy();
  }
}
