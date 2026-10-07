/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { MaterialRequisitionController } from './material-requisition.controller';

import { MaterialRequisitionService } from './material-requisition.service';
import { MaterialRequisition } from 'src/database/models/projects/Requisition/pr_material_requisition_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MaterialRequisition,
    ]),
  ],

  controllers: [MaterialRequisitionController],

  providers: [MaterialRequisitionService],

  exports: [MaterialRequisitionService],
})
export class MaterialRequisitionModule {}
