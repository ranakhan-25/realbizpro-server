/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { BoqController } from './boq.controller';

import { BoqService } from './boq.service';
import { Boq } from 'src/database/models/projects/boq/pr_boq.model';
import { Project } from 'src/database/models/projects/project/pr_project.model'; // relation: project check

@Module({
  imports: [
    SequelizeModule.forFeature([
      Boq,
      Project,
    ]), // relation: Project add
  ],

  controllers: [BoqController],

  providers: [BoqService],

  exports: [BoqService],
})
export class BoqModule {}
