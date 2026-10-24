/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Building } from 'src/database/models/projects/building/pr_building_model';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

@Module({
  imports: [SequelizeModule.forFeature([Building])],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService],
})
export class BuildingModule {}
