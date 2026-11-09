import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsLegalVerification } from '../../../database/models/lams/legal-verification.model';
import { CreateLegalVerificationDto } from './dto/create-legal-verification.dto';
import { UpdateLegalVerificationDto } from './dto/update-legal-verification.dto';

@Injectable()
export class LegalVerificationService {
  constructor(
    @InjectModel(LamsLegalVerification)
    private readonly legalVerificationModel: typeof LamsLegalVerification,
  ) {}

  async create(createDto: CreateLegalVerificationDto): Promise<LamsLegalVerification> {
    return await this.legalVerificationModel.create(createDto as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsLegalVerification[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.legalVerificationModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<LamsLegalVerification> {
    const record = await this.legalVerificationModel.findOne({
      where: { uuid },
    });
    if (!record) throw new NotFoundException('Legal verification record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateLegalVerificationDto): Promise<LamsLegalVerification> {
    const record = await this.findOne(uuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(uuid: string): Promise<void> {
    const record = await this.findOne(uuid);
    await record.destroy();
  }
}
