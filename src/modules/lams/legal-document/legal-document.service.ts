import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LegalDocument } from '../../../database/models/lams/legal-document.model';
import { CreateLegalDocumentDto } from './dto/create-legal-document.dto';

@Injectable()
export class LegalDocumentService {
  constructor(
    @InjectModel(LegalDocument)
    private readonly legalDocumentModel: typeof LegalDocument,
  ) {}

  async create(createDto: CreateLegalDocumentDto): Promise<LegalDocument> {
    return await this.legalDocumentModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<LegalDocument[]> {
    return await this.legalDocumentModel.findAll();
  }
}
