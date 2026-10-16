import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { FollowUp } from '../../../database/models/lams/follow-up.model';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';
import { LegalDocument } from '../../../database/models/lams/legal-document.model';
import { AcquisitionLeadController } from './acquisition-lead.controller';
import { AcquisitionLeadService } from './acquisition-lead.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AcquisitionLead,
      LandOwner,
      FollowUp,
      NegotiationProcess,
      LegalDocument,
    ]),
  ],
  controllers: [AcquisitionLeadController],
  providers: [AcquisitionLeadService],
})
export class AcquisitionLeadModule {}
