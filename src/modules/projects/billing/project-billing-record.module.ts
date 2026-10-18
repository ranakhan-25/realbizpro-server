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
} from './project-billing-resources.controller';
import { ProjectBillingRecordService } from './project-billing-record.service';
import { BillInvoiceModule } from './bill-invoice/bill-invoice.module';
import { ItemModule } from './item/item.module';
import { InvoiceItemModule } from './invoice-item/invoice-item.module';
import { WorkOrder } from 'src/database/models/projects/billing/work-order/pr_work_order.model';
import { WorkOrderController } from './work-order/work-order.controller';
import { WorkOrderService } from './work-order/work-order.service';
import { CustomerAccountModule } from '../contract/customer-accounts/customer_accounts.module';

@Module({
  imports: [SequelizeModule.forFeature([ProjectBillingRecord, Project, WorkOrder]), BillInvoiceModule, CustomerAccountModule, ItemModule, InvoiceItemModule],
  controllers: [
    ProjectBillItemsController,
    ProjectServiceWorkNamesController,
    ProjectBillInvoicesController,
    ProjectContractorBillsController,
    ProjectLabourWorkBillsController,
    ProjectContractorWorkOrdersController,
    WorkOrderController,
    ProjectPeriodBillingsController,
    ProjectAdjustmentBillingsController,
    ProjectQuotesController,
    ProjectBillingRecordController,
  ],
  providers: [ProjectBillingRecordService, WorkOrderService],
  exports: [SequelizeModule],
})
export class ProjectBillingRecordModule {}
