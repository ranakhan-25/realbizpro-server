import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FeaturesController } from './feature.controller';
import { FeaturesService } from './feature.service';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    SequelizeModule.forFeature([
      SysFeatures,
      SysPermission,
      SysRole,
      SysRolePermission,
      SysModules,
    ]),
    UsersModule,
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
