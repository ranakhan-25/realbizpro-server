import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProcurementWorkOrder } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderMeasurement } from 'src/database/models/procurement/work-order/pr_work_order_measurement.model';
import { QueryWorkOrderMeasurementDto } from './dto/query-work-order-measurement.dto';

@Injectable()
export class WorkOrderMeasurementService {
  constructor(
    @InjectModel(ProcurementWorkOrderMeasurement) private readonly measurements: typeof ProcurementWorkOrderMeasurement,
    @InjectModel(ProcurementWorkOrder) private readonly workOrders: typeof ProcurementWorkOrder,
    @InjectModel(Project) private readonly projects: typeof Project,
  ) {}

  private readonly includes = [
    { association: 'workOrder', attributes: ['uuid', 'work_order_no', 'title', 'type', 'status'] },
    { association: 'project', attributes: ['uuid', 'code', 'name'] },
  ];

  async dropdowns() {
    const [projects, workOrders] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.workOrders.findAll({ attributes: ['uuid', 'work_order_no', 'title', 'project_id'], include: [{ association: 'project', attributes: ['uuid', 'code', 'name'] }], order: [['createdAt', 'DESC']] }),
    ]);
    const statuses = await this.measurements.findAll({ attributes: ['status'], group: ['status'], raw: true }) as Array<{ status: string }>;
    return { projects, workOrders, statuses: statuses.map(({ status }) => status) };
  }

  async findAll(query: QueryWorkOrderMeasurementDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = {};
    if (query.measurement_no) where.measurement_no = { [Op.iLike]: `%${query.measurement_no}%` };
    if (query.work_order_id) where.work_order_id = query.work_order_id;
    if (query.project_id) where.project_id = query.project_id;
    if (query.status) where.status = query.status;
    if (query.is_billed !== undefined) where.is_billed = query.is_billed;
    if (query.date_from || query.date_to) where.date = { ...(query.date_from ? { [Op.gte]: query.date_from } : {}), ...(query.date_to ? { [Op.lte]: query.date_to } : {}) };
    const { rows, count } = await this.measurements.findAndCountAll({ where, include: this.includes, distinct: true, limit, offset: (page - 1) * limit, order: [['date', 'DESC'], ['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findOne(uuid: string) {
    const row = await this.measurements.findOne({ where: { uuid } as any, include: this.includes });
    if (!row) throw new NotFoundException(`Measurement ${uuid} was not found`);
    return row;
  }
}
