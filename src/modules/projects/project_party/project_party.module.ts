/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectParty } from 'src/database/models/projects/project_party/pr_project_party_model';
import { ProjectPartyService } from './project_party.service';
import { ProjectPartyController } from './project_party.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectParty]), 
  ],
  controllers: [ProjectPartyController],
  providers: [ProjectPartyService],
  exports: [ProjectPartyService],
})
export class ProjectPartyModule {}