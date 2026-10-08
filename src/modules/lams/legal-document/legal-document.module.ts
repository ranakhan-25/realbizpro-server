import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegalDocument } from '../../../database/models/lams/legal-document.model';
import { LegalDocumentController } from './legal-document.controller';
import { LegalDocumentService } from './legal-document.service';

@Module({
  imports: [SequelizeModule.forFeature([LegalDocument])],
  controllers: [LegalDocumentController],
  providers: [LegalDocumentService],
})
export class LegalDocumentModule {}
