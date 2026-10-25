import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadProfession } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadProfession, Lead])],
  controllers: [ProfessionController],
  providers: [ProfessionService],
  exports: [ProfessionService],
})
export class ProfessionModule {}
