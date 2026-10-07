import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { AcquisitionLeadController } from './acquisition-lead.controller';
import { AcquisitionLeadService } from './acquisition-lead.service';

@Module({
  imports: [SequelizeModule.forFeature([AcquisitionLead])],
  controllers: [AcquisitionLeadController],
  providers: [AcquisitionLeadService],
})
export class AcquisitionLeadModule {}
