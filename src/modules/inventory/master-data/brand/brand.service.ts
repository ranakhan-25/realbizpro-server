import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvBrand } from '../../../../database/models/inventory/inv_brand.model';
import { CreateInvBrandDto } from './dto/create-inv-brand.dto';
import { UpdateInvBrandDto } from './dto/update-inv-brand.dto';

@Injectable()
export class InvBrandService {
  constructor(
    @InjectModel(InvBrand)
    private readonly brandModel: typeof InvBrand,
  ) {}

  async create(createDto: CreateInvBrandDto): Promise<InvBrand> {
    try {
      return await this.brandModel.create(createDto as any);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Brand with this code already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<InvBrand[]> {
    return await this.brandModel.findAll();
  }

  async findOne(uuid: string): Promise<InvBrand> {
    const brand = await this.brandModel.findByPk(uuid);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(uuid: string, updateDto: UpdateInvBrandDto): Promise<InvBrand> {
    const brand = await this.findOne(uuid);
    await brand.update(updateDto as any);
    return brand;
  }

  async remove(uuid: string): Promise<void> {
    const brand = await this.findOne(uuid);
    await brand.destroy();
  }
}
