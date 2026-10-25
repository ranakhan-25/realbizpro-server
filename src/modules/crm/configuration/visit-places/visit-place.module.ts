import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadVisitPlace } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { VisitPlaceController } from './visit-place.controller';
import { VisitPlaceService } from './visit-place.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadVisitPlace, LeadActivity])],
  controllers: [VisitPlaceController],
  providers: [VisitPlaceService],
  exports: [VisitPlaceService],
})
export class VisitPlaceModule {}
