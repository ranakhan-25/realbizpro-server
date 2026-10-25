import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysMenu } from '../../database/models/system/sys_menu.model';
import { SysModules } from '../../database/models/system/sys_module.model';
import { SysFeatures } from '../../database/models/system/sys_features.model';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysModules,
      SysMenu,
      SysFeatures,
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService, SequelizeModule],
})
export class ModulesModule {}
