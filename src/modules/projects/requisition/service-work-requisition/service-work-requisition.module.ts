/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ServiceWorkRequisitionController } from './service-work-requisition.controller';

import { ServiceWorkRequisitionService } from './service-work-requisition.service';

import { ServiceWorkRequisition } from 'src/database/models/projects/Requisition/pr_service_work_requisition.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ServiceWorkRequisition,
    ]),
  ],

  controllers: [ServiceWorkRequisitionController],

  providers: [ServiceWorkRequisitionService],

  exports: [ServiceWorkRequisitionService],
})
export class ServiceWorkRequisitionModule {}
