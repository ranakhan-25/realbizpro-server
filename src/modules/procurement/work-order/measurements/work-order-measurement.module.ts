import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProcurementWorkOrder } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from 'src/database/models/procurement/work-order/pr_work_order_measurement.model';
import { WorkOrderMeasurementController } from './work-order-measurement.controller';
import { WorkOrderMeasurementService } from './work-order-measurement.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProcurementWorkOrder, ProcurementWorkOrderMeasurement])],
  controllers: [WorkOrderMeasurementController],
  providers: [WorkOrderMeasurementService],
  exports: [WorkOrderMeasurementService],
})
export class WorkOrderMeasurementModule {}
