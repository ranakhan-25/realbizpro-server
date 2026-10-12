import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { NegotiationProcessController } from './negotiation-process.controller';
import { NegotiationProcessService } from './negotiation-process.service';

@Module({
  imports: [SequelizeModule.forFeature([NegotiationProcess, AcquisitionLead])],
  controllers: [NegotiationProcessController],
  providers: [NegotiationProcessService],
})
export class NegotiationProcessModule {}
