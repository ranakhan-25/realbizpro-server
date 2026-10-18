/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MaterialRequisitionService } from './material-requisition.service';
import { MaterialRequisitionController } from './material-requisition.controller';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { MaterialRequisitionItem } from 'src/database/models/projects/material-requisition-item/pr_material_requisition_item.model';
import { ProjectModule } from '../../project/project.module';
import { MaterialRequisitionItemModule } from '../material-requisition-item/material-requisition-item.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MaterialRequisition,
      MaterialRequisitionItem,
      Project,
      Site,
      BillingCategory,
    ]),
    ProjectModule,
    MaterialRequisitionItemModule,
  ],
  controllers: [MaterialRequisitionController],
  providers: [MaterialRequisitionService],
  exports: [MaterialRequisitionService],
})
export class MaterialRequisitionModule {}
