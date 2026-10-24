/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectMilestone } from 'src/database/models/projects/project_milestone/pr_project_milestone_model'; // ✅ সঠিক পাথ
import { ProjectMilestoneService } from './project_milestone.service';
import { ProjectMilestoneController } from './project_milestone.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectMilestone]),
  ],
  controllers: [ProjectMilestoneController],
  providers: [ProjectMilestoneService],
  exports: [ProjectMilestoneService],
})
export class ProjectMilestoneModule {}