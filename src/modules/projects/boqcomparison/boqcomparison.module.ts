/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoqComparison } from 'src/database/models/projects/boqcomparison/boq-comparison.model';
import { BoqComparisonController } from './boqcomparison.controller';
import { BoqComparisonService } from './boqcomparison.service';


@Module({
  imports: [SequelizeModule.forFeature([BoqComparison])],
  controllers: [BoqComparisonController],
  providers: [BoqComparisonService],
  exports: [BoqComparisonService],
})
export class BoqComparisonModule {}