/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectBillingRecord } from 'src/database/models/projects/billing/pr_project_billing_record.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectBillingRecordController } from './project-billing-record.controller';
import {
  ProjectAdjustmentBillingsController,
  ProjectBillInvoicesController,
  ProjectBillItemsController,
  ProjectContractorBillsController,
  ProjectContractorWorkOrdersController,
  ProjectLabourWorkBillsController,
  ProjectPeriodBillingsController,
  ProjectQuotesController,
  ProjectServiceWorkNamesController,
  ProjectWorkOrdersController,
} from './project-billing-resources.controller';
import { ProjectBillingRecordService } from './project-billing-record.service';

@Module({
  imports: [SequelizeModule.forFeature([ProjectBillingRecord, Project])],
  controllers: [
    ProjectBillItemsController,
    ProjectServiceWorkNamesController,
    ProjectBillInvoicesController,
    ProjectContractorBillsController,
    ProjectLabourWorkBillsController,
    ProjectWorkOrdersController,
    ProjectContractorWorkOrdersController,
    ProjectPeriodBillingsController,
    ProjectAdjustmentBillingsController,
    ProjectQuotesController,
    ProjectBillingRecordController,
  ],
  providers: [ProjectBillingRecordService],
  exports: [SequelizeModule],
})
export class ProjectBillingRecordModule {}
