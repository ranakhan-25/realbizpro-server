

/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland_model';
import { FlatLandController } from './flatland.controller';
import { FlatLandService } from './flatland.service';

@Module({
  imports: [SequelizeModule.forFeature([FlatLand])],
  controllers: [FlatLandController],
  providers: [FlatLandService],
  exports: [FlatLandService],
})
export class FlatLandModule {}