/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ServiceWorkRequisitionItemController } from './service-work-requisition-item.controller';

import { ServiceWorkRequisitionItemService } from './service-work-requisition-item.service';

import { ServiceWorkRequisitionItem } from 'src/database/models/projects/Requisition/pr_service_work_requisition_item_model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ServiceWorkRequisitionItem,
    ]),
  ],

  controllers: [
    ServiceWorkRequisitionItemController,
  ],

  providers: [ServiceWorkRequisitionItemService],

  exports: [ServiceWorkRequisitionItemService],
})
export class ServiceWorkRequisitionItemModule {}
