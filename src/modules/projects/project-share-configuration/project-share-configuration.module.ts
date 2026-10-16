import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectShareConfiguration } from 'src/database/models/projects/project-share-configuration/pr_project_share_configuration.model';
import { ProjectShareConfigurationController } from './project-share-configuration.controller';
import { ProjectShareConfigurationService } from './project-share-configuration.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProjectShareConfiguration])],
  controllers: [ProjectShareConfigurationController],
  providers: [ProjectShareConfigurationService],
  exports: [ProjectShareConfigurationService],
})
export class ProjectShareConfigurationModule {}
