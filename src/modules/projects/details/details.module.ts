/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { Details } from 'src/database/models/projects/details/pr_details.model';

@Module({
  imports: [SequelizeModule.forFeature([Details])],
  controllers: [DetailsController],
  providers: [DetailsService],
  exports: [DetailsService],
})
export class DetailsModule {}