import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { LandOwnerController } from './land-owner.controller';
import { LandOwnerService } from './land-owner.service';

@Module({
  imports: [SequelizeModule.forFeature([LandOwner, AcquisitionLead])],
  controllers: [LandOwnerController],
  providers: [LandOwnerService],
})
export class LandOwnerModule {}
