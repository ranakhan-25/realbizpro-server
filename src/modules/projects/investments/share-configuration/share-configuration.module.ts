/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ShareConfigurationController } from './share-configuration.controller';
import { ShareConfigurationService } from './share-configuration.service';

import { ShareConfiguration } from 'src/database/models/projects/investor/configuration_model';

import { Investor } from 'src/database/models/projects/investor/investor_model';
import { Project } from 'src/database/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ShareConfiguration,
      Project,
      Investor,
    ]),
  ],

  controllers: [ShareConfigurationController],

  providers: [ShareConfigurationService],

  exports: [ShareConfigurationService],
})
export class ShareConfigurationModule {}
