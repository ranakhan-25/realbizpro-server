import { Module } from '@nestjs/common';
import { AcquisitionLeadModule } from './acquisition-lead/acquisition-lead.module';
import { LandOwnerModule } from './land-owner/land-owner.module';
import { NegotiationProcessModule } from './negotiation-process/negotiation-process.module';
import { LegalDocumentModule } from './legal-document/legal-document.module';
import { FollowUpModule } from './follow-up/follow-up.module';

@Module({
  imports: [
    AcquisitionLeadModule,
    LandOwnerModule,
    NegotiationProcessModule,
    LegalDocumentModule,
    FollowUpModule,
  ],
})
export class LamsModule {}
