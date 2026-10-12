import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FollowUp } from '../../../database/models/lams/follow-up.model';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { FollowUpController } from './follow-up.controller';
import { FollowUpService } from './follow-up.service';

@Module({
  imports: [SequelizeModule.forFeature([FollowUp, AcquisitionLead])],
  controllers: [FollowUpController],
  providers: [FollowUpService],
})
export class FollowUpModule {}
