import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenu } from '../../../database/models/system/sys_menu.model';
import { AdminMenuController } from './admin-menu.controller';
import { AdminMenuService } from './admin-menu.service';

@Module({
  imports: [SequelizeModule.forFeature([SysMenu])],
  controllers: [AdminMenuController],
  providers: [AdminMenuService],
  exports: [AdminMenuService],
})
export class AdminMenuModule {}
