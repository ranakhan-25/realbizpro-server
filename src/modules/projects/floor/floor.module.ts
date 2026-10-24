/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FloorService } from './floor.service';
import { FloorController } from './floor.controller';
import { Floor } from 'src/database/models/projects/floor/pr_floor_model';
import { UnitPlot } from 'src/database/models/projects/unit_plot/pr_unit_plot_model';



@Module({
  imports: [SequelizeModule.forFeature([Floor,UnitPlot])],
  controllers: [FloorController],
  providers: [FloorService],
  exports: [FloorService],
})
export class FloorModule {}