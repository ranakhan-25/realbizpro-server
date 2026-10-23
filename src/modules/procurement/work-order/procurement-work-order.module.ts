import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Contractor } from 'src/database/models/projects/contract/pr_contractor.model';
import { ServiceWorkRequisition } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';
import { ServiceWorkRequisitionItem } from 'src/database/models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import { ProcurementWorkOrder } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderItem } from 'src/database/models/procurement/work-order/pr_procurement_work_order_item.model';
import { ProcurementWorkOrderController } from './procurement-work-order.controller';
import { ProcurementWorkOrderService } from './procurement-work-order.service';
import { WorkOrderMeasurementModule } from './measurements/work-order-measurement.module';
import { WorkBillModule } from './work-bills/work-bill.module';

@Module({
  imports: [SequelizeModule.forFeature([Project, Contractor, ServiceWorkRequisition, ServiceWorkRequisitionItem, ProcurementWorkOrder, ProcurementWorkOrderItem]), WorkOrderMeasurementModule, WorkBillModule],
  controllers: [ProcurementWorkOrderController],
  providers: [ProcurementWorkOrderService],
  exports: [ProcurementWorkOrderService],
})
export class ProcurementWorkOrderModule {}
