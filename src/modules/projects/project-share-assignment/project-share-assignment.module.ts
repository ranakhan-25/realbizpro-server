import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectShareAssignment } from 'src/database/models/projects/project-share-assignment/pr_project_share_assignment.model';
import { ProjectShareAssignmentController } from './project-share-assignment.controller';
import { ProjectShareAssignmentService } from './project-share-assignment.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProjectShareAssignment])],
  controllers: [ProjectShareAssignmentController],
  providers: [ProjectShareAssignmentService],
  exports: [ProjectShareAssignmentService],
})
export class ProjectShareAssignmentModule {}
