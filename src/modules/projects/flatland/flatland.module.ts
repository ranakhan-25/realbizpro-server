

/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { LandInfrastructure } from 'src/database/models/projects/land-infrastructure/pr_land_infrastructure.model';
import { FlatLandController } from './flatland.controller';
import {
  FlatLandDetailsController,
  FlatRecordsController,
} from './flatland-resources.controller';
import { FlatLandService } from './flatland.service';

@Module({
  imports: [SequelizeModule.forFeature([FlatLand, Project, Site, LandInfrastructure])],
  controllers: [
    FlatRecordsController,
    FlatLandDetailsController,
    FlatLandController,
  ],
  providers: [FlatLandService],
  exports: [FlatLandService],
})
export class FlatLandModule {}
