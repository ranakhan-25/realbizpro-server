import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SysOfficeTypeController } from './hrm_office_type.controller';
import { SysOfficeTypeService } from './hrm_office_type.service';
import { OfficeAccessScopeService } from '@/common/services/office-access-scope.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [SysOfficeTypeController],
  providers: [
    SysOfficeTypeService,
    OfficeAccessScopeService,
  ],
  exports: [SysOfficeTypeService],
})
export class SysOfficeTypeModule {}
