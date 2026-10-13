import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import {
  CreateCrRecoveryLogDto,
  UpdateCrRecoveryLogDto,
} from './dto/create-cr-recovery.dto';

@Injectable()
export class CrRecoveryService {
  constructor(
    @InjectModel(CrRecoveryLog)
    private readonly recoveryModel: typeof CrRecoveryLog,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
  ) {}

  async create(createDto: CreateCrRecoveryLogDto) {
    return await this.recoveryModel.create(createDto as any);
  }

  async findAll() {
    return await this.recoveryModel.findAll({
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
      order: [['action_date', 'DESC']],
    });
  }

  async findOne(uuid: string) {
    const item = await this.recoveryModel.findOne({
      where: { uuid },
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
    });
    if (!item) throw new NotFoundException('Recovery log not found');
    return item;
  }

  async update(uuid: string, updateDto: UpdateCrRecoveryLogDto) {
    const item = await this.findOne(uuid);
    await item.update(updateDto as any);
    return item;
  }
}
