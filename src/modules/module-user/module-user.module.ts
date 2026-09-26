import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysModules } from '../../database/models/system/sys_module.model';
import { SysUser } from '../../database/models/system/sys_user.model';
import { ModuleUserController } from './module-user.controller';
import { ModuleUserService } from './module-user.service';
import { SysModuleToUser } from '../../database/models/system/sys_module_to_user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysModules,
      SysUser,
      SysModuleToUser,
    ]),
  ],
  controllers: [ModuleUserController],
  providers: [ModuleUserService],
  exports: [ModuleUserService],
})
export class ModuleUserModule {}
