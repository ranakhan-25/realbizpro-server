import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOfficeController } from './sys-office.controller';
import { SysOfficeService } from './sys-office.service';
import { OfficeAccessScopeService } from '@/common/services/office-access-scope.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [SysOfficeController],
  providers: [
    SysOfficeService,
    OfficeAccessScopeService,
  ],
})
export class SysOfficeModule {}
