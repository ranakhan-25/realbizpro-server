import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysPlan } from '@/database/models/system/sys_plan.model';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [SequelizeModule.forFeature([SysPlan])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService, SequelizeModule],
})
export class PlansModule {}
