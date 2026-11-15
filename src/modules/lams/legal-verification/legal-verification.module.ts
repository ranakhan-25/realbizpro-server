import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LamsLegalVerification } from '../../../database/models/lams/legal-verification.model';
import { LegalVerificationController } from './legal-verification.controller';
import { LegalVerificationService } from './legal-verification.service';

@Module({
  imports: [SequelizeModule.forFeature([LamsLegalVerification])],
  controllers: [LegalVerificationController],
  providers: [LegalVerificationService],
  exports: [LegalVerificationService],
})
export class LegalVerificationModule {}
