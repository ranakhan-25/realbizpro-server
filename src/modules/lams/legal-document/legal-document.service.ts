import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LegalDocument } from '../../../database/models/lams/legal-document.model';
import { CreateLegalDocumentDto } from './dto/create-legal-document.dto';
import { UpdateLegalDocumentDto } from './dto/update-legal-document.dto';

@Injectable()
export class LegalDocumentService {
  constructor(
    @InjectModel(LegalDocument)
    private readonly legalDocumentModel: typeof LegalDocument,
  ) {}

  async create(createDto: CreateLegalDocumentDto): Promise<LegalDocument> {
    return await this.legalDocumentModel.create(createDto as any);
  }

  async findAll(): Promise<LegalDocument[]> {
    return await this.legalDocumentModel.findAll({
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
  }

  async findOne(uuid: string): Promise<LegalDocument> {
    const document = await this.legalDocumentModel.findByPk(uuid, {
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
    if (!document) throw new NotFoundException('Legal Document not found');
    return document;
  }

  async update(uuid: string, updateDto: UpdateLegalDocumentDto): Promise<LegalDocument> {
    const document = await this.findOne(uuid);
    await document.update(updateDto as any);
    return document;
  }

  async remove(uuid: string): Promise<void> {
    const document = await this.findOne(uuid);
    await document.destroy();
  }
}
