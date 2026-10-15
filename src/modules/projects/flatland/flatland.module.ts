

/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandController } from './flatland.controller';
import {
  FlatLandDetailsController,
  FlatRecordsController,
} from './flatland-resources.controller';
import { FlatLandService } from './flatland.service';

@Module({
  imports: [SequelizeModule.forFeature([FlatLand])],
  controllers: [
    FlatRecordsController,
    FlatLandDetailsController,
    FlatLandController,
  ],
  providers: [FlatLandService],
  exports: [FlatLandService],
})
export class FlatLandModule {}