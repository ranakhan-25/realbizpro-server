import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvSubCategory } from '../../../../database/models/inventory/inv_sub_category.model';
import { CreateInvSubCategoryDto } from './dto/create-inv-sub-category.dto';
import { UpdateInvSubCategoryDto } from './dto/update-inv-sub-category.dto';

@Injectable()
export class InvSubCategoryService {
  constructor(
    @InjectModel(InvSubCategory)
    private readonly subCategoryModel: typeof InvSubCategory,
  ) {}

  async create(createDto: CreateInvSubCategoryDto): Promise<InvSubCategory> {
    try {
      return await this.subCategoryModel.create(createDto as any);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Sub-category with this code already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<InvSubCategory[]> {
    return await this.subCategoryModel.findAll();
  }

  async findOne(uuid: string): Promise<InvSubCategory> {
    const subCategory = await this.subCategoryModel.findByPk(uuid);
    if (!subCategory) throw new NotFoundException('Sub-category not found');
    return subCategory;
  }

  async update(uuid: string, updateDto: UpdateInvSubCategoryDto): Promise<InvSubCategory> {
    const subCategory = await this.findOne(uuid);
    await subCategory.update(updateDto as any);
    return subCategory;
  }

  async remove(uuid: string): Promise<void> {
    const subCategory = await this.findOne(uuid);
    await subCategory.destroy();
  }
}
