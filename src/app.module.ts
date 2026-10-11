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
import { CategoryModule } from './modules/projects/billing/category/category.module';
import { SubCategoryModule } from './modules/projects/billing/sub-category/sub-category.module';

import { ServiceWorkRequisitionItemModule } from './modules/projects/requisition/service-work-requisition-item/service-work-requisition-item.module';
import { ServiceWorkRequisitionModule } from './modules/projects/requisition/service-work-requisition/service-work-requisition.module';
import { ContractorModule } from './modules/projects/contract/contractor/contractor.module';
import { InvestorModule } from './modules/projects/investments/investor/investor.module';
import { ShareConfigurationModule } from './modules/projects/investments/share-configuration/share-configuration.module';
import { BoqModule } from './modules/projects/boq/boq.module';
import { FlatLandModule } from './modules/projects/flatland/flatland.module';
import { TaskModule } from './modules/projects/task/task.module';
import { BoqComparisonModule } from './modules/projects/boqcomparison/boqcomparison.module';
import { DetailsModule } from './modules/projects/details/details.module';
import { SysDivisionModule } from './modules/system/sys-division/sys-division.module';
import { QuotationModule } from './modules/projects/quotation/quotation.module';
import { ProjectModule } from './modules/projects/projects/project.module';
import { DepartmentModule } from './modules/hrm/employee/department/department.module';
import { DesignationModule } from './modules/hrm/employee/designation/designation.module';

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
    BoqModule,
    TaskModule,
    BoqComparisonModule,
    DetailsModule,
    QuotationModule,
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
    CustomerAccountModule,
    SupplierAccountsModule,
    LabourWorkBankModule,
    ContractorModule,
    FlatLandModule,
    InvestorModule,
    ShareConfigurationModule,
    MaterialRequisitionModule,
    FundRequisitionModule,
    ServiceWorkRequisitionModule,
    ServiceWorkRequisitionItemModule,
    CategoryModule,
    InventoryModule,
    SubCategoryModule,
    LamsModule,
    DepartmentModule,
    DesignationModule,
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
