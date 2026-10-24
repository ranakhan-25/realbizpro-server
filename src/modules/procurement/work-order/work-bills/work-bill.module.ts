import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Contractor } from 'src/database/models/projects/contract/pr_contractor.model';
import { ProcurementWorkOrder } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from 'src/database/models/procurement/work-order/pr_work_order_measurement.model';
import { ProcurementWorkBill } from 'src/database/models/procurement/work-order/pr_work_bill.model';
import { WorkBillController } from './work-bill.controller';
import { WorkBillService } from './work-bill.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, Contractor, ProcurementWorkOrder, ProcurementWorkOrderMeasurement, ProcurementWorkBill])],
  controllers: [WorkBillController],
  providers: [WorkBillService],
  exports: [WorkBillService],
})
export class WorkBillModule {}
