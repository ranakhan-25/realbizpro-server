import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysCompany } from './models/system/sys_company.model';
import { SysCountries } from './models/system/sys_countries.model';
import { SysDelegationStatus } from './models/deligation/sys_delegation_statuses.model';
import { SysUom } from './models/system/sys_uom.model';
import { SysUserPermission } from './models/system/sys_user_permission.model';
import { SequelizeConfigService } from './sequelize-config.service';
import { DatabaseSyncService } from './sync.service';
import { Project } from './models/projects/project/pr_project.model';
import { ProjectType } from './models/projects/project-type/pr_project_type.model';
import { Site } from './models/projects/project-site/pr_project_site.model';
import { Investor } from './models/projects/investor/investor.model';
import { InvestorNominee } from './models/projects/investor/investor_nominee.model';
import { ShareConfiguration } from './models/projects/investor/configuration.model';
import { BillingCategory } from './models/projects/billing/pr_category.model';
import { BillingSubCategory } from './models/projects/billing/pr_sub_category.model';
import { Category } from './models/procurement/configuration/products/pr_category.model';
import { CategoryAccountMapping } from './models/procurement/configuration/products/pr_category_account_mapping.model';
import { ProcurementSubCategory } from './models/procurement/configuration/products/pr_sub_category.model';
import { ProcurementBrand } from './models/procurement/configuration/products/pr_brand.model';
import { ProcurementUnit } from './models/procurement/configuration/products/pr_unit.model';
import { ProcurementItemEntry } from './models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementAssetCategory } from './models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from './models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProjectAgreement } from './models/projects/project_aggrement/pr_project_aggrement_model';
import { ProjectParty } from './models/projects/project_party/pr_project_party_model';
import { SysPlan } from './models/system/sys_plan.model';
import { SysOrganization } from './models/system/sys_organization.model';
import { SysOrgEntitlement } from './models/system/sys_org_entitlement.model';
import { SysRoleFeature } from './models/system/sys_role_feature.model';
import { SysUserFeatureOverride } from './models/system/sys_user_feature_override.model';
import {
  SysTenantSite,
  SysTenantMenu,
  SysTenantMenuItem,
  SysTenantPage,
  SysTenantPageBlock,
} from './models/cms';
import { ChartOfGroup } from './models/accounts/configuration/acc_chats_of_group_model';
import { ChartOfAccount } from './models/accounts/configuration/acc_chats_of_accounts_model';
import { LeadPropertyInterest } from './models/crm/lead/crm-lead-property-interest.model';
import { ExpenseItem } from './models/accounts/vouchers/acc_expense-item.model';
import { Expense } from './models/accounts/vouchers/acc_expence_list_model';
import { Voucher } from './models/accounts/vouchers/acc_voucher.model';
import { VoucherEntry } from './models/accounts/vouchers/acc_voucher-entry.model';
import { PaymentVoucher } from './models/accounts/vouchers/acc_payment-voucher.model';
import { PaymentVoucherEntry } from './models/accounts/vouchers/acc_payment-voucher-entry.model';
import { JournalVoucher } from './models/accounts/vouchers/acc_journal-voucher.model';
import { JournalVoucherItem } from './models/accounts/vouchers/acc_journal-voucher-item.model';
import { ContraVoucher } from './models/accounts/vouchers/acc_contra-voucher.model';
import { ContraVoucherItem } from './models/accounts/vouchers/acc_contra-voucher-item.model';
import { BankReconciliation } from './models/accounts/bank-reconciliation/acc_bank-reconciliation.model';
import { Cheque } from './models/accounts/bank-reconciliation/acc_cheque.model';
import { ChequeRange } from './models/accounts/bank-reconciliation/acc_cheque-range.model';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([
      SysCountries,
      SysDelegationStatus,
      SysCompany,
      SysUom,
      SysUserPermission,
      Project,
      ProjectType,
      Site,
      Investor,
      InvestorNominee,
      ShareConfiguration,
      BillingCategory,
      BillingSubCategory,
      Category,
      CategoryAccountMapping,
      ProcurementSubCategory,
      ProcurementBrand,
      ProcurementUnit,
      ProcurementItemEntry,
      ProcurementAssetCategory,
      ProcurementAssetItemEntry,
      ProjectAgreement,
      ProjectParty,
      SysPlan,
      SysOrganization,
      SysOrgEntitlement,
      SysRoleFeature,
      SysUserFeatureOverride,
      SysTenantSite,
      SysTenantMenu,
      SysTenantMenuItem,
      SysTenantPage,
      SysTenantPageBlock,
      ChartOfAccount,
      ChartOfGroup, 
      LeadPropertyInterest,
      ExpenseItem, 
      Expense,
      Voucher,
      VoucherEntry,
      PaymentVoucher,
      PaymentVoucherEntry,
      JournalVoucher,
      JournalVoucherItem,
      ContraVoucher,
      ContraVoucherItem, 
      BankReconciliation, 
      Cheque,
      ChequeRange,
      
    ]),
  ],
  providers: [
    SequelizeConfigService,
    DatabaseSyncService,
  ],
  exports: [
    SequelizeConfigService,
    SequelizeModule,
  ],
})
export class DatabaseModule {}
