import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadArea } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadArea, Lead])],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
