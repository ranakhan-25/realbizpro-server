import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaterialRequisitionController } from './material-requisition.controller';
import { Requisition } from 'src/database/models/projects/Requisition/re_material_requisition_model';
import { RequisitionService } from './material-requisition.service';

@Module({
  imports: [SequelizeModule.forFeature([Requisition])],
  controllers: [MaterialRequisitionController],
  providers: [RequisitionService],
  exports: [RequisitionService],
})
export class RequisitionModule {}