import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenu } from '../../database/models/system/sys_menu.model';
import { SysMenuPermission } from '../../database/models/system/sys_menu_permission.model';
import { SysModules } from '../../database/models/system/sys_module.model';
import { ModuleUserModule } from '../module-user/module-user.module';
import { AuthModule } from '../user-management/auth/auth.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysMenu,
      SysModules,
      SysMenuPermission,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => ModuleUserModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
