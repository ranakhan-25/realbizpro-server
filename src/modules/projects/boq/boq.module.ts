/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BoqService } from './boq.service';
import { BoqController } from './boq.controller';
import { Boq } from 'src/database/models/projects/boq/pr_boq.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';

@Module({
  imports: [SequelizeModule.forFeature([Boq,Project])],
  controllers: [BoqController],
  providers: [BoqService],
  exports: [BoqService],
})
export class BoqModule {}
