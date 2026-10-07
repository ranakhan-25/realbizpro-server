import { Module } from '@nestjs/common';
import { AcquisitionLeadModule } from './acquisition-lead/acquisition-lead.module';
import { LandOwnerModule } from './land-owner/land-owner.module';

@Module({
  imports: [
    AcquisitionLeadModule,
    LandOwnerModule,
  ],
})
export class LamsModule {}
