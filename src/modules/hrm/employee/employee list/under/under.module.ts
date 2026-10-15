import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { UnderController } from './under.controller';

import { UnderService } from './under.service';
import { Under } from 'src/database/models/hrm/employee/hrm_under_model';

@Module({
  imports: [SequelizeModule.forFeature([Under])],

  controllers: [UnderController],

  providers: [UnderService],

  exports: [UnderService],
})
export class UnderModule {}
