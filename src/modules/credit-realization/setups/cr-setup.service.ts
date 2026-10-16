import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrInstallmentSetup } from '../../../database/models/credit-realization/cr_installment_setup.model';
import {
  CreateCrInstallmentSetupDto,
  UpdateCrInstallmentSetupDto,
} from './dto/create-cr-setup.dto';

@Injectable()
export class CrSetupService {
  constructor(
    @InjectModel(CrInstallmentSetup)
    private readonly setupModel: typeof CrInstallmentSetup,
  ) {}

  async create(createDto: CreateCrInstallmentSetupDto) {
    return await this.setupModel.create(createDto as any);
  }

  async findAll() {
    return await this.setupModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findOne(uuid: string) {
    const item = await this.setupModel.findOne({ where: { uuid } });
    if (!item) throw new NotFoundException('Installment Setup not found');
    return item;
  }

  async update(uuid: string, updateDto: UpdateCrInstallmentSetupDto) {
    const item = await this.findOne(uuid);
    await item.update(updateDto as any);
    return item;
  }

  async remove(uuid: string) {
    const item = await this.findOne(uuid);
    await item.destroy();
    return { success: true, message: 'Installment Setup deleted' };
  }
}
