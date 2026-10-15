/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectDocument } from 'src/database/models/projects/project-document/pr_project_document.model';
import { ProjectDocumentController } from './project-document.controller';
import { ProjectDocumentService } from './project-document.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProjectDocument])],
  controllers: [ProjectDocumentController],
  providers: [ProjectDocumentService],
  exports: [ProjectDocumentService],
})
export class ProjectDocumentModule {}
