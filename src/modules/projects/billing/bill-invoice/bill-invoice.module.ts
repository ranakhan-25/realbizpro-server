/* eslint-disable prettier/prettier */

import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { BillInvoiceController } from './bill-invoice.controller';
import { BillInvoiceService } from './bill-invoice.service';

import { Invoice } from 'src/database/models/projects/billing/pr_invoice.model';
import { InvoiceItem } from 'src/database/models/projects/billing/pr_invoice_item.model';
import { Item } from 'src/database/models/projects/billing/pr_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';
import { CustomerAccount } from 'src/database/models/projects/contract/pr_customer_accounts.model';

@Injectable()
class RegisterBillInvoiceModels implements OnModuleInit {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  onModuleInit() {
    const models = [
      Invoice,
      InvoiceItem,
      CustomerAccount,
      Item,
      Project,
      ProjectType,
      BillingCategory,
      BillingSubCategory,
    ];
    const unregistered = models.filter(
      (model) => !this.sequelize.isDefined(model.name),
    );
    if (unregistered.length) this.sequelize.addModels(unregistered);
  }
}

@Module({
  imports: [
    SequelizeModule.forFeature([
      Invoice,
      InvoiceItem,
      CustomerAccount, // 👈 MUST
      Item, // 👈 MUST
      Project, // 👈 MUST
      ProjectType, // 👈 MUST
    ]),
  ],
  controllers: [BillInvoiceController],
  providers: [BillInvoiceService, RegisterBillInvoiceModels],
})
export class BillInvoiceModule {}
