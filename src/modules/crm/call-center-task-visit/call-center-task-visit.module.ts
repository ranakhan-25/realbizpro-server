import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadActivity, Lead, LeadVisitPlace, LeadVisitStatus, SysUser } from 'src/database/models/crm/call-center/task-visit';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { CallCenterTaskVisitController, TaskVisitDetailsReportController } from './call-center-task-visit.controller';
import { CallCenterTaskVisitService } from './call-center-task-visit.service';
@Module({ imports: [SequelizeModule.forFeature([LeadActivity, Lead, LeadVisitPlace, LeadVisitStatus, LeadStage, SysUser])], controllers: [CallCenterTaskVisitController, TaskVisitDetailsReportController], providers: [CallCenterTaskVisitService] })
export class CallCenterTaskVisitModule {}
