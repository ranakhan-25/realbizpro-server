import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvUnit } from '../../../../database/models/inventory/inv_unit.model';
import { CreateInvUnitDto } from './dto/create-inv-unit.dto';
import { UpdateInvUnitDto } from './dto/update-inv-unit.dto';

@Injectable()
export class InvUnitService {
  constructor(
    @InjectModel(InvUnit)
    private readonly unitModel: typeof InvUnit,
  ) {}

  async create(createDto: CreateInvUnitDto): Promise<InvUnit> {
    try {
      return await this.unitModel.create(createDto as any);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Unit with this code already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<InvUnit[]> {
    return await this.unitModel.findAll();
  }

  async findOne(uuid: string): Promise<InvUnit> {
    const unit = await this.unitModel.findByPk(uuid);
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async update(uuid: string, updateDto: UpdateInvUnitDto): Promise<InvUnit> {
    const unit = await this.findOne(uuid);
    await unit.update(updateDto as any);
    return unit;
  }

  async remove(uuid: string): Promise<void> {
    const unit = await this.findOne(uuid);
    await unit.destroy();
  }
}
