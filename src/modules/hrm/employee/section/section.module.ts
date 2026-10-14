/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { SectionController } from './section.controller';

import { SectionService } from './section.service';
import { Section } from 'src/database/models/hrm/employee/hrm_section_model';

@Module({
  imports: [
    SequelizeModule.forFeature([Section]),
  ],

  controllers: [SectionController],

  providers: [SectionService],

  exports: [SectionService],
})
export class SectionModule {}
