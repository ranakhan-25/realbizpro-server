import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysSubscriptionPayment } from '../../../database/models/system/sys_subscription_payment.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SslcommerzService } from './sslcommerz.service';
import { SubscriptionPaymentsController } from './subscription-payments.controller';
import { SubscriptionPaymentsService } from './subscription-payments.service';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([
      SysSubscriptionPayment,
      SysOrganization,
      SysPlan,
      SysUser,
      SysRole,
      SysUserRole,
    ]),
  ],
  controllers: [SubscriptionPaymentsController],
  providers: [SubscriptionPaymentsService, SslcommerzService, InvoiceService],
  exports: [SubscriptionPaymentsService, SslcommerzService, InvoiceService],
})
export class SubscriptionPaymentsModule {}
