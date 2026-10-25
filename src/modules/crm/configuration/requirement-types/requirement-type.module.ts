import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadRequirementType } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { RequirementTypeController } from './requirement-type.controller';
import { RequirementTypeService } from './requirement-type.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadRequirementType, LeadRequirement])],
  controllers: [RequirementTypeController],
  providers: [RequirementTypeService],
  exports: [RequirementTypeService],
})
export class RequirementTypeModule {}
