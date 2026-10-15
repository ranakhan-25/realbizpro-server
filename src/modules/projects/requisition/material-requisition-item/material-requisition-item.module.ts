/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaterialRequisitionItemService } from './material-requisition-item.service';
import { MaterialRequisitionItemController } from './material-requisition-item.controller';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { MaterialRequisitionItem } from 'src/database/models/projects/material-requisition-item/pr_material_requisition_item.model';
import { ProjectModule } from '../../project/project.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MaterialRequisition,
      MaterialRequisitionItem,
      Project,
    ]),
    ProjectModule,
  ],
  controllers: [
    MaterialRequisitionItemController,
  ],
  providers: [MaterialRequisitionItemService],
  exports: [MaterialRequisitionItemService],
})
export class MaterialRequisitionItemModule {}
