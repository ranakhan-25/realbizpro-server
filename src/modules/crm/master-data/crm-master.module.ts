import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmLeadCategory } from '../../../database/models/crm/crm_lead_category.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmCampaign } from '../../../database/models/crm/crm_campaign.model';
import { CrmProfession } from '../../../database/models/crm/crm_profession.model';
import { CrmTeam } from '../../../database/models/crm/crm_team.model';
import { CrmTeamMember } from '../../../database/models/crm/crm_team_member.model';
import { CrmArea } from '../../../database/models/crm/crm_area.model';
import { CrmFeature } from '../../../database/models/crm/crm_feature.model';
import { CrmPriceRange } from '../../../database/models/crm/crm_price_range.model';
import { CrmRequirementType } from '../../../database/models/crm/crm_requirement_type.model';
import { CrmVisitPlace } from '../../../database/models/crm/crm_visit_place.model';
import { CrmVisitStatus } from '../../../database/models/crm/crm_visit_status.model';
import { CrmTaskType } from '../../../database/models/crm/crm_task_type.model';
import { CrmMasterService } from './crm-master.service';
import { CrmMasterController } from './crm-master.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrmLeadCategory,
      CrmLeadStage,
      CrmLeadSource,
      CrmCampaign,
      CrmProfession,
      CrmTeam,
      CrmTeamMember,
      CrmArea,
      CrmFeature,
      CrmPriceRange,
      CrmRequirementType,
      CrmVisitPlace,
      CrmVisitStatus,
      CrmTaskType,
    ]),
  ],
  controllers: [CrmMasterController],
  providers: [CrmMasterService],
  exports: [CrmMasterService],
})
export class CrmMasterModule {}
