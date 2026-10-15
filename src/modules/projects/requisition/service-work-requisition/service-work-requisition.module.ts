/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ServiceWorkRequisitionController } from './service-work-requisition.controller';
import { ServiceWorkRequisitionService } from './service-work-requisition.service';

import { ServiceWorkRequisition } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';
import { ServiceWorkRequisitionItem } from 'src/database/models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ServiceWorkRequisition,
      ServiceWorkRequisitionItem,
      Project,
      Site,
      BillingCategory,
      BillingSubCategory,
    ]),
  ],

  controllers: [ServiceWorkRequisitionController],

  providers: [ServiceWorkRequisitionService],

  exports: [ServiceWorkRequisitionService],
})
export class ServiceWorkRequisitionModule {}
