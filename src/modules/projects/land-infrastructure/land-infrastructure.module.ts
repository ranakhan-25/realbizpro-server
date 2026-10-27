import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { LandInfrastructure } from 'src/database/models/projects/land-infrastructure/pr_land_infrastructure.model';
import { LandInfrastructureController } from './land-infrastructure.controller';
import {
  LandBlocksController,
  LandRoadsController,
} from './land-infrastructure-resources.controller';
import { LandInfrastructureService } from './land-infrastructure.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, Site, LandInfrastructure])],
  controllers: [
    LandRoadsController,
    LandBlocksController,
    LandInfrastructureController,
  ],
  providers: [LandInfrastructureService],
  exports: [LandInfrastructureService],
})
export class LandInfrastructureModule {}
