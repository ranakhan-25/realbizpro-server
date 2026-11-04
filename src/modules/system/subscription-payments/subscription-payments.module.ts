import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';
import { SysSubscriptionPayment } from '../../../database/models/system/sys_subscription_payment.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SslcommerzService } from './sslcommerz.service';
import { SubscriptionPaymentsController } from './subscription-payments.controller';
import { SubscriptionPaymentsService } from './subscription-payments.service';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([
      SysSubscriptionPayment,
      SysOrganization,
      SysPlan,
      SysUser,
    ]),
  ],
  controllers: [SubscriptionPaymentsController],
  providers: [SubscriptionPaymentsService, SslcommerzService],
  exports: [SubscriptionPaymentsService, SslcommerzService],
})
export class SubscriptionPaymentsModule {}
