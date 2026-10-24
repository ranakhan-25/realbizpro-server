import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Contractor, ContractorStatus, ContractorUnderStatus } from 'src/database/models/projects/contract/pr_contractor.model';
import { ServiceWorkRequisition, ServiceWorkRequisitionStatus } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';
import { ServiceWorkRequisitionItem } from 'src/database/models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import { ProcurementWorkOrder, ProcurementWorkOrderMode, ProcurementWorkOrderStatus } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';
import { ProcurementWorkOrderItem } from 'src/database/models/procurement/work-order/pr_procurement_work_order_item.model';
import { CreateProcurementWorkOrderDto, QueryProcurementWorkOrderDto } from './dto/procurement-work-order.dto';

@Injectable()
export class ProcurementWorkOrderService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(ProcurementWorkOrder) private readonly orders: typeof ProcurementWorkOrder,
    @InjectModel(ProcurementWorkOrderItem) private readonly lines: typeof ProcurementWorkOrderItem,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(Contractor) private readonly contractors: typeof Contractor,
    @InjectModel(ServiceWorkRequisition) private readonly requisitions: typeof ServiceWorkRequisition,
    @InjectModel(ServiceWorkRequisitionItem) private readonly requisitionItems: typeof ServiceWorkRequisitionItem,
  ) {}

  private readonly includes = [
    { association: 'project', attributes: ['uuid', 'code', 'name'] },
    { association: 'subcontractor', attributes: ['uuid', 'code', 'name', 'businessName', 'mobileNo'] },
    { association: 'requisition', attributes: ['uuid', 'requisitionCode', 'requisitionDate', 'status'] },
    { association: 'items', include: [{ association: 'requisitionItem', attributes: ['uuid', 'code', 'serviceItemName', 'unitType'] }] },
  ];

  async dropdowns(projectId?: string) {
    const [projects, subcontractors, approvedRequisitions] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.contractors.findAll({ where: { status: ContractorStatus.ACTIVE, under: ContractorUnderStatus.CONTRACTOR } as any, attributes: ['uuid', 'code', 'name', 'businessName', 'mobileNo'], order: [['name', 'ASC']] }),
      this.requisitions.findAll({ where: { status: ServiceWorkRequisitionStatus.APPROVED, ...(projectId ? { targetProjectId: projectId } : {}) } as any, attributes: ['uuid', 'requisitionCode', 'requisitionDate', 'targetProjectId', 'grandTotalPayable'], include: [{ association: 'items' }, { association: 'project', attributes: ['uuid', 'code', 'name'] }], order: [['createdAt', 'DESC']] }),
    ]);
    return { projects, subcontractors, approvedRequisitions, modes: Object.values(ProcurementWorkOrderMode), types: ['subcontract', 'labour'], statuses: Object.values(ProcurementWorkOrderStatus) };
  }

  private async validate(dto: CreateProcurementWorkOrderDto, transaction: Transaction) {
    if (!(await this.projects.findOne({ where: { uuid: dto.project_id } as any, transaction }))) throw new BadRequestException('Selected project was not found');
    if (!(await this.contractors.findOne({ where: { uuid: dto.subcontractor_id, status: ContractorStatus.ACTIVE, under: ContractorUnderStatus.CONTRACTOR } as any, transaction }))) throw new BadRequestException('Select an active subcontractor');
    if (dto.mode === ProcurementWorkOrderMode.REQUISITION_BASED) {
      if (!dto.requisition_id) throw new BadRequestException('Approved requisition is required for requisition-based work orders');
      const req = await this.requisitions.findOne({ where: { uuid: dto.requisition_id, targetProjectId: dto.project_id, status: ServiceWorkRequisitionStatus.APPROVED } as any, transaction });
      if (!req) throw new BadRequestException('Only an approved labor/subcontract requisition for the selected project can be used');
      if (dto.items.some((line) => !line.requisition_item_id)) throw new BadRequestException('Every requisition-based line must reference its requisition item');
    } else if (dto.requisition_id) throw new BadRequestException('Free work orders cannot reference a requisition');
    if (dto.start_date && dto.end_date && dto.end_date < dto.start_date) throw new BadRequestException('End date must not be earlier than start date');
    const itemIds = dto.items.map((line) => line.requisition_item_id).filter((id): id is string => Boolean(id));
    if (itemIds.length) {
      const validItems = await this.requisitionItems.findAll({ where: { uuid: { [Op.in]: itemIds }, serviceWorkRequisitionId: dto.requisition_id } as any, attributes: ['uuid'], transaction });
      if (validItems.length !== new Set(itemIds).size) throw new BadRequestException('A selected line item does not belong to the chosen requisition');
    }
  }

  private totals(dto: CreateProcurementWorkOrderDto) {
    const items = dto.items.map((item) => {
      const amount = Number((item.quantity * item.rate).toFixed(2));
      const tax_amount = Number((amount * Number(item.tax_percent ?? 0) / 100).toFixed(2));
      const vat_amount = Number((amount * Number(item.vat_percent ?? 0) / 100).toFixed(2));
      return { ...item, tax_percent: item.tax_percent ?? 0, vat_percent: item.vat_percent ?? 0, amount, tax_amount, vat_amount };
    });
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const vat_total = items.reduce((sum, item) => sum + item.vat_amount, 0);
    const ait_tds_total = items.reduce((sum, item) => sum + item.tax_amount, 0);
    const discount = Number(dto.order_discount ?? 0);
    if (discount > subtotal + vat_total) throw new BadRequestException('Order discount cannot exceed the order value');
    return { items, subtotal: Number(subtotal.toFixed(2)), vat_total: Number(vat_total.toFixed(2)), ait_tds_total: Number(ait_tds_total.toFixed(2)), discount, contract_amount: Number((subtotal + vat_total - ait_tds_total - discount).toFixed(2)) };
  }

  async create(dto: CreateProcurementWorkOrderDto) {
    return this.sequelize.transaction(async (transaction) => {
      await this.validate(dto, transaction);
      const totals = this.totals(dto);
      const order = await this.orders.create({ work_order_no: `WO-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`, title: dto.title.trim(), mode: dto.mode, type: dto.type, requisition_id: dto.requisition_id, project_id: dto.project_id, subcontractor_id: dto.subcontractor_id, start_date: dto.start_date, end_date: dto.end_date, notes: dto.notes, status: dto.status ?? ProcurementWorkOrderStatus.PENDING, subtotal: totals.subtotal, vat_total: totals.vat_total, ait_tds_total: totals.ait_tds_total, discount: totals.discount, contract_amount: totals.contract_amount }, { transaction });
      await this.lines.bulkCreate(totals.items.map(({ requisition_item_id, description, unit, quantity, rate, tax_percent, vat_percent, amount, tax_amount, vat_amount }) => ({ work_order_id: order.uuid, requisition_item_id, description, unit, quantity, rate, tax_percent, vat_percent, amount, tax_amount, vat_amount })), { transaction });
      return this.findOne(order.uuid, transaction);
    });
  }

  async findAll(query: QueryProcurementWorkOrderDto, onlyDeleted = false) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = {};
    if (query.project_id) where.project_id = query.project_id;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.work_order_no) where.work_order_no = { [Op.iLike]: `%${query.work_order_no}%` };
    if (query.search) where[Op.or] = [{ work_order_no: { [Op.iLike]: `%${query.search}%` } }, { title: { [Op.iLike]: `%${query.search}%` } }];
    if (onlyDeleted) where.deleted_at = { [Op.ne]: null };
    const { rows, count } = await this.orders.findAndCountAll({ where, include: this.includes, paranoid: !onlyDeleted, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const order = await this.orders.findOne({ where: { uuid } as any, include: this.includes, transaction });
    if (!order) throw new NotFoundException(`Work order ${uuid} was not found`);
    return order;
  }

  async update(uuid: string, dto: CreateProcurementWorkOrderDto) {
    return this.sequelize.transaction(async (transaction) => {
      const order = await this.orders.findOne({ where: { uuid } as any, transaction });
      if (!order) throw new NotFoundException(`Work order ${uuid} was not found`);
      await this.validate(dto, transaction);
      const totals = this.totals(dto);
      await order.update({ title: dto.title.trim(), mode: dto.mode, type: dto.type, requisition_id: dto.requisition_id, project_id: dto.project_id, subcontractor_id: dto.subcontractor_id, start_date: dto.start_date, end_date: dto.end_date, notes: dto.notes, status: dto.status ?? order.status, subtotal: totals.subtotal, vat_total: totals.vat_total, ait_tds_total: totals.ait_tds_total, discount: totals.discount, contract_amount: totals.contract_amount }, { transaction });
      await this.lines.destroy({ where: { work_order_id: uuid }, transaction });
      await this.lines.bulkCreate(totals.items.map(({ requisition_item_id, description, unit, quantity, rate, tax_percent, vat_percent, amount, tax_amount, vat_amount }) => ({ work_order_id: uuid, requisition_item_id, description, unit, quantity, rate, tax_percent, vat_percent, amount, tax_amount, vat_amount })), { transaction });
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string) { const order = await this.orders.findOne({ where: { uuid } as any }); if (!order) throw new NotFoundException('Work order not found'); await order.destroy(); return { message: 'Work order moved to trash' }; }
  async restore(uuid: string) { const order = await this.orders.findOne({ where: { uuid } as any, paranoid: false }); if (!order || !order.deletedAt) throw new NotFoundException('Deleted work order not found'); await order.restore(); return this.findOne(uuid); }
}
