import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  SysTenantSite,
  SysTenantMenu,
  SysTenantMenuItem,
  SysTenantPage,
  SysTenantPageBlock,
} from '../../../database/models/cms';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { TenantCmsController } from './tenant-cms.controller';
import { TenantCmsService } from './tenant-cms.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysTenantSite,
      SysTenantMenu,
      SysTenantMenuItem,
      SysTenantPage,
      SysTenantPageBlock,
      SysOrganization,
    ]),
  ],
  controllers: [TenantCmsController],
  providers: [TenantCmsService],
  exports: [TenantCmsService],
})
export class TenantCmsModule {}
