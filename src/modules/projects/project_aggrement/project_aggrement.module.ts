/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectAgreement } from 'src/database/models/projects/project_aggrement/pr_project_aggrement_model';
import { ProjectAgreementService } from './project_aggrement.service';
import { ProjectAgreementController } from './project_aggrement.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectAgreement]),
  ],
  controllers: [ProjectAgreementController],
  providers: [ProjectAgreementService],
  exports: [ProjectAgreementService],
})
export class ProjectAgreementModule {}