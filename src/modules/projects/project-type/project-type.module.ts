import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectType } from 'src/database/models/projects/pr_project_types_model';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeService } from './project-type.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectType]),
  ],
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService],
  exports: [ProjectTypeService],
})
export class ProjectTypeModule {}
