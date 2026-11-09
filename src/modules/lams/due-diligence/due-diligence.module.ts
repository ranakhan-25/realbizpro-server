import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LamsDueDiligence } from '../../../database/models/lams/due-diligence.model';
import { DueDiligenceController } from './due-diligence.controller';
import { DueDiligenceService } from './due-diligence.service';

@Module({
  imports: [SequelizeModule.forFeature([LamsDueDiligence])],
  controllers: [DueDiligenceController],
  providers: [DueDiligenceService],
  exports: [DueDiligenceService],
})
export class DueDiligenceModule {}
