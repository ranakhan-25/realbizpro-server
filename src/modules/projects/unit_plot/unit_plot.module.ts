/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitPlot } from 'src/database/models/projects/unit_plot/pr_unit_plot_model';
import { UnitPlotController } from './unit_plot.controller';
import { UnitPlotService } from './unit_plot.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UnitPlot]), // ✅ শুধু UnitPlot
  ],
  controllers: [UnitPlotController],
  providers: [UnitPlotService],
  exports: [UnitPlotService],
})
export class UnitPlotModule {}