import { IdLogicModule } from '@easysofts/id-logic';
import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import {
  APP_GUARD,
  APP_INTERCEPTOR,
} from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import * as path from 'path';
import { AppController } from './app.controller';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AppService } from './app.service';
import { AuthLoggingInterceptor } from './common/interceptors/auth-logging.interceptor';
import { ErrorTransformInterceptor } from './common/interceptors/error-transform.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CacheModule } from './common/services/cache.module';

import {
  getRealIP,
  isLocalhost,
} from './common/utils/ip.util';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import {
  fileConfig,
  minioConfig,
} from './config/file.config';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import securityConfig from './config/security.config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './database/redis.module';
import { HealthController } from './modules/engine/health/health.controller';
import { S3minioModule } from './modules/engine/s3minio/s3minio.module';
import { AuthModule } from './modules/engine/user-management/auth/auth.module';
import { MobileUserModule } from './modules/engine/user-management/mobile-user/mobile-user.module';
import { UsersModule } from './modules/engine/user-management/users/users.module';
import { SysOfficeModule } from './modules/system/sys-office/sys-office.module';
import { NotificationModule } from './modules/notifications/notifications.module';

import { SysOfficeTypeModule } from './modules/system/hrm_office_type/hrm_office_type.module';
import { JobLogModule } from './modules/system/job-log/job-log.module';
import { CompanyModule } from './modules/system/sys-company/sys-company.module';
import { HmacAuthModule } from './modules/engine/hmac-auth/hmac-auth.module';
import { BullBoardModule } from './modules/engine/queue-dashboard/bull-board.module';

import { HrmMobileAuthFaceModule } from './modules/user-management/hrm-mobile-auth-face/hrm-mobile-auth-face.module';
import { FeaturesModule } from './modules/user-management/features/feature.module';
import { RolesModule } from './modules/user-management/roles/roles.module';
import { PermissionsModule } from './modules/user-management/permissions/permissions.module';
import { EmailModule } from './modules/email/email.module';
import { ModulesModule } from './modules/modules/modules.module';
import { MenuModule } from './modules/menu/menu.module';
import { ModuleUserModule } from './modules/module-user/module-user.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { ProjectTypeModule } from './modules/projects/project-type/project-type.module';

import { ProjectSiteModule } from './modules/projects/project-site/project-site.module';
import { CustomerAccountModule } from './modules/projects/contract/customer-accounts/customer_accounts.module';
import { SupplierAccountsModule } from './modules/projects/contract/supplier-accounts/supplier_accounts.module';
import { LabourWorkBankModule } from './modules/projects/contract/labour-work-bank/labour_work_bank.module';
import { LamsModule } from './modules/lams/lams.module';
import { MaterialRequisitionModule } from './modules/projects/requisition/material-requisition/material-requisition.module';
import { FundRequisitionModule } from './modules/projects/requisition/fund-requisition/fund-requisition.module';

import { ServiceWorkRequisitionItemModule } from './modules/projects/requisition/service-work-requisition-item/service-work-requisition-item.module';
import { ServiceWorkRequisitionModule } from './modules/projects/requisition/service-work-requisition/service-work-requisition.module';
import { ContractorModule } from './modules/projects/contract/contractor/contractor.module';
import { InvestorModule } from './modules/projects/investments/investor/investor.module';
import { BoqModule } from './modules/projects/boq/boq.module';
import { FlatLandModule } from './modules/projects/flatland/flatland.module';
import { TaskModule } from './modules/projects/task/task.module';
import { BoqComparisonModule } from './modules/projects/boqcomparison/boqcomparison.module';
import { DetailsModule } from './modules/projects/details/details.module';
import { SysDivisionModule } from './modules/system/sys-division/sys-division.module';
import { QuotationModule } from './modules/projects/quotation/quotation.module';
import { CrmModule } from './modules/crm/crm.module';
import { CreditRealizationModule } from './modules/credit-realization/credit-realization.module';
import { DepartmentModule } from './modules/hrm/employee/department/department.module';
import { DesignationModule } from './modules/hrm/employee/designation/designation.module';
import { ShiftModule } from './modules/hrm/employee/shift/shift.module';
import { AttendanceModule } from './modules/hrm/employee/shift  allocation/attendance.module';

import { MonthYearModule } from './modules/hrm/employee/shift  allocation/month-year.module';
import { BonusModule } from './modules/hrm/employee/bonus/bonus.module';

import { BonusGenerateModule } from './modules/hrm/employee/bonus-generate/bonus-generate.module';
import { SectionModule } from './modules/hrm/employee/section/section.module';
import { UnitModule } from './modules/hrm/employee/unit/unit.module';
import { ProjectModule } from './modules/projects/project/project.module';
import { ProjectDocumentModule } from './modules/projects/project-document/project-document.module';
import { ProjectShareConfigurationModule } from './modules/projects/project-share-configuration/project-share-configuration.module';
import { LandInfrastructureModule } from './modules/projects/land-infrastructure/land-infrastructure.module';
import { FlatLandOfferModule } from './modules/projects/flat-land-offer/flat-land-offer.module';
import { ProjectBillingRecordModule } from './modules/projects/billing/project-billing-record.module';
import { ShareConfigurationModule } from './modules/projects/investments/share-configuration/share-configuration.module';
import { ProjectShareAssignmentModule } from './modules/projects/project-share-assignment/project-share-assignment.module';
import { CategoryModule } from './modules/projects/billing/category/category.module';
import { SubCategoryModule } from './modules/projects/billing/sub-category/sub-category.module';
import { FlatLandBookingModule } from './modules/projects/flat-land-booking/flat-land-booking.module';
import { CommissionModule } from './modules/hrm/employee/employee list/commission/commission.module';
import { AllowanceModule } from './modules/hrm/employee/employee list/allowance/allowance.module';
import { EmployeeListModule } from './modules/hrm/employee/employee list/employee-list/employee-list.module';
import { EmployeeSalaryModule } from './modules/hrm/employee/employee list/employee-salary/employee-salary.module';
import { EmployeeTypeModule } from './modules/hrm/employee/employee list/employee-type/employee-type.module';

import { LoanModule } from './modules/hrm/employee/employee list/loan/loan.module';
import { OvertimeModule } from './modules/hrm/employee/employee list/overtime/overtime.module';

import { SaturationDeductionModule } from './modules/hrm/employee/employee list/saturation-deduction/saturation-deduction.module';
import { UnderModule } from './modules/hrm/employee/employee list/under/under.module';
import { EmployeeHierarchyModule } from './modules/hrm/employee/employee-hierarchy/employee-hierarchy.module';
import { EmployeeCardModule } from './modules/hrm/employee/employee-card/employee-card.module';
import { IncrementModule } from './modules/hrm/employee/increment/increment.module';
import { CategoryModule as ProcurementCategoryModule } from './modules/procurement/configuration/products/category/category.module';
import { AccountMappingModule } from './modules/procurement/configuration/products/account-mapping/account-mapping.module';
import { ProcurementSubCategoryModule } from './modules/procurement/configuration/products/sub-category/sub-category.module';
import { ProcurementBrandModule } from './modules/procurement/configuration/products/brand/brand.module';
import { ProcurementUnitModule } from './modules/procurement/configuration/products/unit/unit.module';
import { ProcurementItemEntryModule } from './modules/procurement/configuration/products/item-entry/item-entry.module';
import { ProcurementAssetCategoryModule } from './modules/procurement/configuration/asset/asset-category/asset-category.module';
import { ProcurementAssetItemEntryModule } from './modules/procurement/configuration/asset/asset-item-entry/asset-item-entry.module';
import { RfqModule } from './modules/procurement/rfq/rfq.module';
import { AssetRfqModule } from './modules/procurement/rfq/asset/asset-rfq.module';
import { ProcurementMaterialRequisitionModule } from './modules/procurement/requisition/material-requisition/procurement-material-requisition.module';
import { AssetRequisitionModule } from './modules/procurement/requisition/asset-requisition/asset-requisition.module';
import { PurchaseOrderModule } from './modules/procurement/purchase-order/purchase-order.module';
import { AssetPurchaseOrderModule } from './modules/procurement/purchase-order/asset/asset-purchase-order.module';
import { GrnModule } from './modules/procurement/grn/grn.module';
import { SalaryGradeModule } from './modules/hrm/employee/employee list/salary-grade/salary-grade.module';
import { AttendanceReconciliationModule } from './modules/hrm/attendance/attendance-reconciliation/attendance-reconciliation.module';
import { AllowanceDeductionSetupModule } from './modules/hrm/configuration/allowance-deduction-setup/allowance-deduction-setup.module';
import { DeductionRuleModule } from './modules/hrm/configuration/deduction-rule/deduction-rule/deduction-rule.module';
import { HolidayModule } from './modules/hrm/configuration/holiday/holiday.module';
import { LeaveTypeModule } from './modules/hrm/configuration/leave-type/leave-type.module';
import { SalaryGradeItemModule } from './modules/hrm/configuration/salary-grade-item/salary-grade-item.module';
import { ZkTecoDeviceModule } from './modules/hrm/configuration/zkteco-device/zkteco-device.module';
import { FloorModule } from './modules/projects/floor/floor.module';

import { ProjectAgreementModule } from './modules/projects/project_aggrement/project_aggrement.module';
import { ProjectMilestoneModule } from './modules/projects/project_milestone/project_milestone.module';
import { BuildingModule } from './modules/projects/building/building.module';
import { ProjectPartyModule } from './modules/projects/project_party/project_party.module';
import { ProjectTaskModule } from './modules/projects/projec_task/projec_task.module';
import { ProjectBudgetModule } from './modules/projects/project_budget/project_budget.module';
import { ProjectCostModule } from './modules/projects/project_cost/project_cost.module';
import { ProjectProgressModule } from './modules/projects/project_progress/project_progress.module';
import { ProjectControlModule } from './modules/projects/project_control/project_control.module';
import { UnitPlotModule } from './modules/projects/unit_plot/unit_plot.module';






@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        securityConfig,
        databaseConfig,
        redisConfig,
        fileConfig,
        minioConfig,
        mailConfig,
      ],
      envFilePath: path.resolve(
        __dirname,
        '../.env',
      ),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl:
              config.get(
                'security.rateLimit.windowMs',
              ) ?? 15 * 60 * 1000,
            limit:
              config.get(
                'security.rateLimit.max',
              ) ?? 100,
          },
        ],
        generateKey: (context) => {
          const request = context
            .switchToHttp()
            .getRequest();
          return getRealIP(request);
        },
        skipIf: (context) => {
          const request = context
            .switchToHttp()
            .getRequest();
          const nodeEnv =
            process.env.NODE_ENV || 'development';
          if (nodeEnv !== 'development')
            return false;
          const realIP = getRealIP(request);
          return isLocalhost(realIP);
        },
        errorMessage:
          'Too many requests from this IP, please try again later.',
      }),
    }),
    IdLogicModule.register(),
    HrmMobileAuthFaceModule,
    MobileUserModule,

    DatabaseModule,
    RedisModule,
    CacheModule,
    AuthModule,
    CompanyModule,
    ModulesModule,
    FeaturesModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    MenuModule,
    ModuleUserModule,
    ApprovalsModule,
    NotificationModule,
    EmailModule,
    MaterialRequisitionModule,
    ProjectTypeModule,
    ProjectSiteModule,
    ProjectModule,
    UsersModule, 
    BuildingModule,
    FloorModule,
    UnitPlotModule,
   
    ProjectAgreementModule,
    ProjectMilestoneModule,
    ProjectPartyModule,
    ProjectTaskModule,
    ProjectBudgetModule,
    ProjectCostModule,
    ProjectProgressModule, 
    ProjectControlModule,
    BoqModule,
    TaskModule,
    BoqComparisonModule,
    DetailsModule,
    QuotationModule,
    LandInfrastructureModule,
    // Hrms Report
    SysDivisionModule,
    SysOfficeTypeModule,
    CompanyModule,
    SysOfficeModule,
    S3minioModule,
    SysDivisionModule,
    JobLogModule,
    HmacAuthModule,
    BullBoardModule,
    BoqModule,
    CategoryModule,
    SubCategoryModule,
    CustomerAccountModule,
    FlatLandBookingModule,
    SupplierAccountsModule,
    LabourWorkBankModule,
    ContractorModule,
    FlatLandModule,
    InvestorModule,
    ProjectShareConfigurationModule,
    MaterialRequisitionModule,
    FundRequisitionModule,
    ProjectBillingRecordModule,
    ServiceWorkRequisitionModule,
    ServiceWorkRequisitionItemModule,
    ProjectDocumentModule,
    InventoryModule,
    FlatLandOfferModule,
    ShareConfigurationModule,
    ProjectShareAssignmentModule,

    LamsModule,
    CrmModule,
    CreditRealizationModule,
    DepartmentModule,
    DesignationModule,
    ShiftModule,
    AttendanceModule,

    MonthYearModule,
    BonusModule,
    BonusGenerateModule,
    SectionModule,
    UnitModule,
    CommissionModule,
    AllowanceModule,
    EmployeeListModule,
    EmployeeSalaryModule,
    EmployeeTypeModule,

    LoanModule,
    OvertimeModule,
    SalaryGradeModule,
    SaturationDeductionModule,
    UnderModule,
    EmployeeHierarchyModule,
    EmployeeCardModule,
    IncrementModule,
    AttendanceReconciliationModule,
    AllowanceDeductionSetupModule,
    DeductionRuleModule,
    HolidayModule,
    LeaveTypeModule,
    SalaryGradeItemModule,
    ZkTecoDeviceModule,
    ProcurementCategoryModule,
    ProcurementSubCategoryModule,
    ProcurementBrandModule,
    ProcurementUnitModule,
    ProcurementItemEntryModule,
    ProcurementAssetCategoryModule,
    ProcurementAssetItemEntryModule,
    RfqModule,
    AssetRfqModule,
    ProcurementMaterialRequisitionModule,
    AssetRequisitionModule,
    PurchaseOrderModule,
    AssetPurchaseOrderModule,
    GrnModule,
    AccountMappingModule,
    ProjectBudgetModule,
    ProjectCostModule,
    ProjectProgressModule,
    ProjectControlModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorTransformInterceptor,
    },
  ],
})
export class AppModule {}
