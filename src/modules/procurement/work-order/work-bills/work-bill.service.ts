import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Contractor } from 'src/database/models/projects/contract/pr_contractor.model';
import { ProcurementWorkOrder } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from 'src/database/models/procurement/work-order/pr_work_order_measurement.model';
import { ProcurementWorkBill, ProcurementWorkBillStatus } from 'src/database/models/procurement/work-order/pr_work_bill.model';
import { CreateWorkBillDto, QueryWorkBillDto, UpdateWorkBillStatusDto } from './dto/work-bill.dto';

@Injectable()
export class WorkBillService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(ProcurementWorkBill) private readonly bills: typeof ProcurementWorkBill,
    @InjectModel(ProcurementWorkOrderMeasurement) private readonly measurements: typeof ProcurementWorkOrderMeasurement,
    @InjectModel(ProcurementWorkOrder) private readonly workOrders: typeof ProcurementWorkOrder,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(Contractor) private readonly contractors: typeof Contractor,
  ) {}

  private readonly includes = [
    { association: 'workOrder', attributes: ['uuid', 'work_order_no', 'title', 'type', 'status'] },
    { association: 'project', attributes: ['uuid', 'code', 'name'] },
    { association: 'vendor', attributes: ['uuid', 'code', 'name', 'businessName', 'mobileNo'] },
    { association: 'measurement', attributes: ['uuid', 'measurement_no', 'date', 'amount', 'status'] },
  ];

  async dropdowns() {
    const [eligibleMeasurements, projects, workOrders, vendors] = await Promise.all([
      this.measurements.findAll({ where: { status: { [Op.iLike]: 'approved' }, is_billed: false }, attributes: ['uuid', 'measurement_no', 'date', 'amount', 'work_order_id', 'project_id'], include: [{ association: 'workOrder', attributes: ['uuid', 'work_order_no', 'title', 'subcontractor_id'], include: [{ association: 'subcontractor', attributes: ['uuid', 'code', 'name', 'businessName'] }] }, { association: 'project', attributes: ['uuid', 'code', 'name'] }], order: [['date', 'DESC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.workOrders.findAll({ attributes: ['uuid', 'work_order_no', 'title'], order: [['createdAt', 'DESC']] }),
      this.contractors.findAll({ attributes: ['uuid', 'code', 'name', 'businessName'], order: [['name', 'ASC']] }),
    ]);
    return { eligibleMeasurements, projects, workOrders, vendors, statuses: Object.values(ProcurementWorkBillStatus) };
  }

  async create(dto: CreateWorkBillDto) {
    return this.sequelize.transaction(async (transaction) => {
      const measurement = await this.measurements.findOne({ where: { uuid: dto.measurement_id } as any, transaction, lock: transaction.LOCK.UPDATE, include: [{ association: 'workOrder' }] });
      if (!measurement) throw new NotFoundException('Measurement not found');
      if (String(measurement.status).toLowerCase() !== 'approved') throw new BadRequestException('Only an approved measurement can be billed');
      if (measurement.is_billed) throw new BadRequestException('This measurement has already been billed');
      const workOrderId = measurement.work_order_id;
      const workOrder = await this.workOrders.findOne({ where: { uuid: workOrderId } as any, transaction });
      if (!workOrder) throw new BadRequestException('The measurement has no valid work order');
      const bill = await this.bills.create({ bill_no: `WB-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`, measurement_id: measurement.uuid, work_order_id: workOrder.uuid, project_id: measurement.project_id, vendor_id: workOrder.subcontractor_id, net_amount: measurement.amount, status: ProcurementWorkBillStatus.PENDING }, { transaction });
      await measurement.update({ is_billed: true }, { transaction });
      return this.findOne(bill.uuid, transaction);
    });
  }

  async findAll(query: QueryWorkBillDto, onlyDeleted = false) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const where: any = {};
    if (query.bill_no) where.bill_no = { [Op.iLike]: `%${query.bill_no}%` };
    if (query.status) where.status = query.status;
    if (onlyDeleted) where.deleted_at = { [Op.ne]: null };
    const { rows, count } = await this.bills.findAndCountAll({ where, include: this.includes, paranoid: !onlyDeleted, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const bill = await this.bills.findOne({ where: { uuid } as any, include: this.includes, transaction });
    if (!bill) throw new NotFoundException(`Work bill ${uuid} was not found`);
    return bill;
  }

  async updateStatus(uuid: string, dto: UpdateWorkBillStatusDto) {
    const bill = await this.bills.findOne({ where: { uuid } as any });
    if (!bill) throw new NotFoundException(`Work bill ${uuid} was not found`);
    await bill.update({ status: dto.status });
    return this.findOne(uuid);
  }
}
