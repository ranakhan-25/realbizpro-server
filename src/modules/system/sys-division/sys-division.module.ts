import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SysDivision } from '@/database/models/system/sys_divisions.model';
import { SysDistrict } from '@/database/models/system/sys_districts.model';
import { SysUser } from '@/database/models/system/sys_user.model';
import { SysUpazila } from '@/database/models/system/sys_upazila.model';
import { DivisionController } from './sys-division.controller';
import { DivisionService } from './sys-division.service';
import { SysUnion } from '@/database/models/system/sys_union.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysDivision,
      SysDistrict,
      SysUpazila,
      SysUser,
      SysUnion,
    ]),
  ],
  controllers: [DivisionController],
  providers: [DivisionService],
})
export class SysDivisionModule {}
