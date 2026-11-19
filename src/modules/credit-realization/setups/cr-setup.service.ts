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

  async create(createDto: CreateCrInstallmentSetupDto, orgId?: string, userEmail?: string) {
    return await this.setupModel.create({
      ...createDto,
      ...(orgId ? { org_id: orgId } : {}),
      ...(userEmail ? { createdBy: userEmail } : {}),
    } as any);
  }

  async findAll(orgId?: string) {
    return await this.setupModel.findAll({
      where: {
        ...(orgId ? { org_id: orgId } : {}),
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string) {
    const item = await this.setupModel.findOne({
      where: {
        uuid,
        ...(orgId ? { org_id: orgId } : {}),
      },
    });
    if (!item) throw new NotFoundException('Installment Setup not found');
    return item;
  }

  async update(
    uuid: string,
    updateDto: UpdateCrInstallmentSetupDto,
    orgId?: string,
    userEmail?: string,
  ) {
    const item = await this.findOne(uuid, orgId);
    await item.update({
      ...(updateDto as any),
      ...(userEmail ? { updatedBy: userEmail } : {}),
    });
    return item;
  }

  async remove(uuid: string, orgId?: string, userEmail?: string) {
    const item = await this.findOne(uuid, orgId);
    if (userEmail) {
      await item.update({ deletedBy: userEmail } as any);
    }
    await item.destroy();
    return { success: true, message: 'Installment Setup deleted' };
  }
}
