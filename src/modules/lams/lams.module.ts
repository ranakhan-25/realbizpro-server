import { Module } from '@nestjs/common';
import { AcquisitionLeadModule } from './acquisition-lead/acquisition-lead.module';
import { LandOwnerModule } from './land-owner/land-owner.module';
import { NegotiationProcessModule } from './negotiation-process/negotiation-process.module';
import { LegalDocumentModule } from './legal-document/legal-document.module';
import { FollowUpModule } from './follow-up/follow-up.module';
import { ValuationModule } from './valuation/valuation.module';
import { LegalVerificationModule } from './legal-verification/legal-verification.module';
import { DueDiligenceModule } from './due-diligence/due-diligence.module';
import { ApprovalModule } from './approval/approval.module';
import { SettlementModule } from './settlement/settlement.module';

@Module({
  imports: [
    AcquisitionLeadModule,
    LandOwnerModule,
    NegotiationProcessModule,
    LegalDocumentModule,
    FollowUpModule,
    ValuationModule,
    LegalVerificationModule,
    DueDiligenceModule,
    ApprovalModule,
    SettlementModule,
  ],
})
export class LamsModule {}
