import { Module } from '@nestjs/common';
import { AcquisitionLeadModule } from './acquisition-lead/acquisition-lead.module';

@Module({
  imports: [
    AcquisitionLeadModule,
    // Other sub-modules like LandOwnerModule, NegotiationProcessModule, etc. will be added here
  ],
})
export class LamsModule {}
