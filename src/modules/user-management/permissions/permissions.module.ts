import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { SysPermission } from '../../../database/models/system/sys_permission.model';

@Module({
  imports: [
    SequelizeModule.forFeature([SysPermission]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
