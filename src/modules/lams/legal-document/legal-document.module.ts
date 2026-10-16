import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegalDocument } from '../../../database/models/lams/legal-document.model';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { LegalDocumentController } from './legal-document.controller';
import { LegalDocumentService } from './legal-document.service';

@Module({
  imports: [SequelizeModule.forFeature([LegalDocument, AcquisitionLead])],
  controllers: [LegalDocumentController],
  providers: [LegalDocumentService],
})
export class LegalDocumentModule {}
