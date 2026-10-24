import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProcurementHireOrder, HireOrderMode, HireOrderStatus } from 'src/database/models/procurement/equipment-hire/pr_hire_order.model';
import { ProcurementHireOrderItem } from 'src/database/models/procurement/equipment-hire/pr_hire_order_item.model';
import { ProcurementHireIn } from 'src/database/models/procurement/equipment-hire/pr_hire_in.model';
import { ProcurementHireInItem } from 'src/database/models/procurement/equipment-hire/pr_hire_in_item.model';
import { ProcurementHireOut } from 'src/database/models/procurement/equipment-hire/pr_hire_out.model';
import { ProcurementHireOutItem } from 'src/database/models/procurement/equipment-hire/pr_hire_out_item.model';
import { ProcurementHireBill } from 'src/database/models/procurement/equipment-hire/pr_hire_bill.model';
import { ProcurementHireBillItem } from 'src/database/models/procurement/equipment-hire/pr_hire_bill_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProcurementAssetRequisition, ProcurementAssetRequisitionApprovalLayer, ProcurementAssetRequisitionStatus } from 'src/database/models/procurement/requisition/pr_asset_requisition.model';
import { ProcurementAssetRequisitionItem } from 'src/database/models/procurement/requisition/pr_asset_requisition_item.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CreateHireBillDto, CreateHireInDto, CreateHireOrderDto, CreateHireOutDto, QueryEquipmentSiteDto, QueryHireMovementDto, QueryHireOrderDto } from './dto/equipment-hire.dto';

const orderInclude: any[] = [
  { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'] },
  { model: Site, as: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { model: SupplierAccounts, as: 'vendor', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { model: ProcurementAssetRequisition, as: 'requisition', attributes: ['uuid', 'code', 'status'], required: false },
  { model: SysUser, as: 'addedBy', attributes: ['id', 'name'], required: false },
  { model: ProcurementHireOrderItem, as: 'items', include: [
    { model: ProcurementAssetItemEntry, as: 'equipment', attributes: ['uuid', 'item_code', 'name'], required: false },
    { model: ProcurementUnit, as: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
];
const movementInclude: any[] = [{ model: ProcurementHireOrder, as: 'hireOrder', include: orderInclude }];
const billInclude: any[] = [
  { model: ProcurementHireOrder, as: 'hireOrder', attributes: ['uuid', 'hire_no', 'status'], required: true },
  { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'] },
  { model: SupplierAccounts, as: 'vendor', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { model: ProcurementHireBillItem, as: 'items', include: [{ model: ProcurementHireOrderItem, as: 'hireOrderItem', attributes: ['uuid', 'equipment_description', 'unit', 'charged_by'], required: false }] },
];

@Injectable()
export class EquipmentHireService {
  constructor(
    @InjectModel(ProcurementHireOrder) private readonly orders: typeof ProcurementHireOrder,
    @InjectModel(ProcurementHireOrderItem) private readonly orderItems: typeof ProcurementHireOrderItem,
    @InjectModel(ProcurementHireIn) private readonly hireIns: typeof ProcurementHireIn,
    @InjectModel(ProcurementHireInItem) private readonly hireInItems: typeof ProcurementHireInItem,
    @InjectModel(ProcurementHireOut) private readonly hireOuts: typeof ProcurementHireOut,
    @InjectModel(ProcurementHireOutItem) private readonly hireOutItems: typeof ProcurementHireOutItem,
    @InjectModel(ProcurementHireBill) private readonly bills: typeof ProcurementHireBill,
    @InjectModel(ProcurementHireBillItem) private readonly billItems: typeof ProcurementHireBillItem,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(Site) private readonly sites: typeof Site,
    @InjectModel(SupplierAccounts) private readonly vendors: typeof SupplierAccounts,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(ProcurementAssetRequisition) private readonly requisitions: typeof ProcurementAssetRequisition,
    @InjectModel(ProcurementAssetRequisitionItem) private readonly requisitionItems: typeof ProcurementAssetRequisitionItem,
    @InjectModel(ProcurementAssetItemEntry) private readonly equipment: typeof ProcurementAssetItemEntry,
    @InjectModel(ProcurementUnit) private readonly units: typeof ProcurementUnit,
    private readonly sequelize: Sequelize,
  ) {}

  async dropdowns(projectId?: string) {
    const [projects, vendors, sites, equipment, units, requisitions, users] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.vendors.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.sites.findAll({ where: projectId ? { projectId } as any : {}, attributes: ['uuid', 'projectId', 'code', 'name', 'location'], order: [['name', 'ASC']] }),
      this.equipment.findAll({ attributes: ['uuid', 'item_code', 'name', 'unit_id', 'category_id'], include: [{ model: ProcurementUnit, as: 'unit', attributes: ['uuid', 'code', 'name'], required: false }], order: [['name', 'ASC']] }),
      this.units.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.requisitions.findAll({ where: { status: ProcurementAssetRequisitionStatus.APPROVED, approval_layer: ProcurementAssetRequisitionApprovalLayer.ALL_APPROVALS_COMPLETED, ...(projectId ? { project_id: projectId } : {}) } as any, include: [{ model: Project, as: 'project', attributes: ['uuid', 'name'], required: false }, { model: ProcurementAssetRequisitionItem, as: 'items', attributes: ['uuid', 'item_id', 'item_code', 'item_name', 'unit_id', 'unit', 'demand_qty', 'rate'], include: [{ model: ProcurementAssetItemEntry, as: 'item', attributes: ['uuid', 'name', 'item_code'], required: false }] }], order: [['date', 'DESC']] }),
      this.users.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    const reqItemIds = requisitions.flatMap((req: any) => (req.items ?? []).map((item: any) => item.uuid));
    const reserved = reqItemIds.length ? await this.orderItems.findAll({ where: { requisition_item_id: { [Op.in]: reqItemIds } } as any }) : [];
    const reservedQty = new Map<string, number>();
    for (const row of reserved as any[]) reservedQty.set(row.requisition_item_id, (reservedQty.get(row.requisition_item_id) ?? 0) + Number(row.quantity));
    const approvedEquipmentRequisitions = requisitions.map((req: any) => ({ ...req.toJSON(), items: (req.items ?? []).map((item: any) => ({ ...item.toJSON(), open_qty: Math.max(0, Number(item.demand_qty) - (reservedQty.get(item.uuid) ?? 0)) })).filter((item: any) => item.open_qty > 0) })).filter((req: any) => req.items.length > 0);
    const [orderStatuses, billStatuses, eligibleHireOrders] = await Promise.all([
      Promise.resolve(Object.values(HireOrderStatus)), Promise.resolve(['pending', 'approved', 'paid', 'partially_paid', 'cancelled']),
      this.orders.findAll({ where: { status: { [Op.in]: [HireOrderStatus.ACTIVE, HireOrderStatus.CLOSED] } }, attributes: ['uuid', 'hire_no', 'project_id', 'vendor_id', 'hire_from', 'hire_to', 'status'], include: [{ model: Project, as: 'project', attributes: ['uuid', 'name'], required: false }, { model: SupplierAccounts, as: 'vendor', attributes: ['uuid', 'supplierName'], required: false }] }),
    ]);
    return { projects, vendors, sites, equipment, units, approvedEquipmentRequisitions, eligibleHireOrders, users, hireModes: Object.values(HireOrderMode), orderStatuses, billStatuses, chargedBy: ['hour', 'day', 'week', 'month', 'shift', 'fixed'] };
  }

  private async list(model: any, query: QueryHireOrderDto | QueryHireMovementDto, numberField: string, include: any[], includeDeleted = false) {
    const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(100, Math.max(1, Number(query.limit) || 10)); const where: any = {};
    const number = (query as QueryHireMovementDto).number ?? (query as QueryHireOrderDto).hire_no;
    if (number) where[numberField] = { [Op.iLike]: `%${number}%` };
    if (query.status) where.status = query.status;
    if ((query as QueryHireMovementDto).hire_order_id) where.hire_order_id = (query as QueryHireMovementDto).hire_order_id;
    if (query.project_id) where[this.orders === model || this.bills === model ? 'project_id' : '$hireOrder.project_id$'] = query.project_id;
    if (includeDeleted) where.deletedAt = { [Op.ne]: null };
    const result = await model.findAndCountAll({ where, include, distinct: true, paranoid: !includeDeleted, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: result.rows, total: result.count, page, limit, totalPages: Math.ceil(result.count / limit) };
  }
  listOrders(query: QueryHireOrderDto) { return this.list(this.orders, query, 'hire_no', orderInclude); }
  listHireIns(query: QueryHireMovementDto) { return this.list(this.hireIns, query, 'hire_in_no', movementInclude); }
  listHireOuts(query: QueryHireMovementDto) { return this.list(this.hireOuts, query, 'hire_out_no', movementInclude); }
  listBills(query: QueryHireMovementDto) { return this.list(this.bills, query, 'bill_no', billInclude); }
  listDeletedOrders(query: QueryHireOrderDto) { return this.list(this.orders, query, 'hire_no', orderInclude, true); }
  listDeletedHireIns(query: QueryHireMovementDto) { return this.list(this.hireIns, query, 'hire_in_no', movementInclude, true); }
  listDeletedHireOuts(query: QueryHireMovementDto) { return this.list(this.hireOuts, query, 'hire_out_no', movementInclude, true); }
  listDeletedBills(query: QueryHireMovementDto) { return this.list(this.bills, query, 'bill_no', billInclude, true); }
  async viewOrder(uuid: string) { const row = await this.orders.findOne({ where: { uuid }, include: orderInclude }); if (!row) throw new NotFoundException('Hire order not found'); return row; }
  async viewHireIn(uuid: string, transaction?: Transaction) { const row = await this.hireIns.findOne({ where: { uuid }, include: [{ model: ProcurementHireOrder, as: 'hireOrder', include: orderInclude }, { model: SysUser, as: 'receivedBy', attributes: ['id', 'name'], required: false }, { model: ProcurementHireInItem, as: 'items', include: [{ model: ProcurementHireOrderItem, as: 'hireOrderItem' }] }], transaction }); if (!row) throw new NotFoundException('Hire In record not found'); return row; }
  async viewHireOut(uuid: string, transaction?: Transaction) { const row = await this.hireOuts.findOne({ where: { uuid }, include: [{ model: ProcurementHireOrder, as: 'hireOrder', include: orderInclude }, { model: SysUser, as: 'returnedBy', attributes: ['id', 'name'], required: false }, { model: ProcurementHireOutItem, as: 'items', include: [{ model: ProcurementHireOrderItem, as: 'hireOrderItem' }] }], transaction }); if (!row) throw new NotFoundException('Hire Out record not found'); return row; }
  async viewBill(uuid: string, transaction?: Transaction) { const row = await this.bills.findOne({ where: { uuid }, include: billInclude, transaction }); if (!row) throw new NotFoundException('Hire bill not found'); return row; }

  private async buildOrderItems(inputs: CreateHireOrderDto['items'], requisitionId?: string, transaction?: Transaction, excludingOrderId?: string) {
    const built: any[] = [];
    for (const input of inputs) {
      const equipment = input.equipment_id ? await this.equipment.findOne({ where: { uuid: input.equipment_id } as any, include: [{ model: ProcurementUnit, as: 'unit' }], transaction }) : null;
      if (input.equipment_id && !equipment) throw new BadRequestException('Selected equipment does not exist');
      const reqItem = input.requisition_item_id ? await this.requisitionItems.findOne({ where: { uuid: input.requisition_item_id } as any, transaction }) : null;
      if (input.requisition_item_id && (!reqItem || reqItem.requisition_id !== requisitionId)) throw new BadRequestException('Equipment requisition item does not belong to selected approved requisition');
      if (requisitionId && !reqItem) throw new BadRequestException('Every requisition-based hire line must select an approved requisition item');
      if (!requisitionId && reqItem) throw new BadRequestException('Free hire lines cannot reference requisition items');
      if (reqItem && equipment && reqItem.item_id !== equipment.uuid) throw new BadRequestException('Selected equipment does not match requisition item');
      if (reqItem) {
        const existing = await this.orderItems.findAll({ where: { requisition_item_id: reqItem.uuid, ...(excludingOrderId ? { hire_order_id: { [Op.ne]: excludingOrderId } } : {}) } as any, transaction });
        const reservedQty = existing.reduce((sum, line) => sum + Number(line.quantity), 0);
        if (reservedQty + Number(input.quantity) > Number(reqItem.demand_qty)) throw new BadRequestException(`Hire quantity exceeds open requisition quantity for ${reqItem.item_name ?? reqItem.item_code}`);
      }
      const unitId = input.unit_id ?? equipment?.unit_id ?? reqItem?.unit_id;
      const unit = unitId ? await this.units.findOne({ where: { uuid: unitId } as any, transaction }) : null;
      if (unitId && !unit) throw new BadRequestException('Selected unit does not exist');
      const qty = Number(input.quantity); const rate = Number(input.rate); const base = qty * rate;
      const taxPercent = Number(input.tax_percent ?? 0); const vatPercent = Number(input.vat_percent ?? 0);
      const equipmentDescription = equipment?.name ?? reqItem?.item_name ?? input.equipment_description;
      const unitName = unit?.name ?? input.unit;
      if (!equipmentDescription || !unitName) throw new BadRequestException('Equipment description and unit are required for every hire line');
      built.push({ equipment_id: equipment?.uuid ?? reqItem?.item_id ?? null, requisition_item_id: reqItem?.uuid ?? null, unit_id: unit?.uuid ?? null, equipment_description: equipmentDescription, unit: unitName, quantity: qty, charged_by: input.charged_by ?? 'day', rate, tax_percent: taxPercent, vat_percent: vatPercent, tax_amount: base * taxPercent / 100, vat_amount: base * vatPercent / 100, amount: base });
    }
    return built;
  }
  private async orderTotals(lines: any[], shipping: number, discount: number) {
    const subtotal = lines.reduce((sum, row) => sum + Number(row.amount), 0);
    const vat_total = lines.reduce((sum, row) => sum + Number(row.vat_amount), 0);
    const ait_tds_total = lines.reduce((sum, row) => sum + Number(row.tax_amount), 0);
    if (discount > subtotal + vat_total) throw new BadRequestException('Discount cannot exceed subtotal plus VAT');
    return { subtotal, vat_total, ait_tds_total, grand_total: Math.max(0, subtotal + vat_total - ait_tds_total - discount + shipping) };
  }
  async createOrder(dto: CreateHireOrderDto, actorId?: number) {
    if (dto.hire_mode === HireOrderMode.REQUISITION_BASED && !dto.requisition_id) throw new BadRequestException('Approved equipment requisition is required for requisition-based hire');
    if (dto.hire_mode === HireOrderMode.FREE_HIRE && dto.requisition_id) throw new BadRequestException('Free hire cannot reference an equipment requisition');
    const project = await this.projects.findOne({ where: { uuid: dto.project_id } as any }); if (!project) throw new BadRequestException('Selected project does not exist');
    if (!(await this.vendors.findOne({ where: { uuid: dto.vendor_id } as any }))) throw new BadRequestException('Selected vendor does not exist');
    if (dto.site_id && !(await this.sites.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) throw new BadRequestException('Selected site does not belong to selected project');
    if (dto.hire_mode === HireOrderMode.REQUISITION_BASED) {
      const req = await this.requisitions.findOne({ where: { uuid: dto.requisition_id, project_id: dto.project_id, status: ProcurementAssetRequisitionStatus.APPROVED, approval_layer: ProcurementAssetRequisitionApprovalLayer.ALL_APPROVALS_COMPLETED } as any });
      if (!req) throw new BadRequestException('Only approved equipment requisitions belonging to the selected project can be used');
    }
    return this.sequelize.transaction(async transaction => {
      const lines = await this.buildOrderItems(dto.items, dto.requisition_id, transaction);
      const shipping = Number(dto.shipping_cost ?? 0); const discount = Number(dto.order_discount ?? 0); const totals = await this.orderTotals(lines, shipping, discount);
      const order = await this.orders.create({ hire_no: dto.hire_no ?? `HO${Date.now()}`, hire_mode: dto.hire_mode, requisition_id: dto.requisition_id, project_id: dto.project_id, site_id: dto.site_id, vendor_id: dto.vendor_id, hire_from: dto.hire_from, hire_to: dto.hire_to, shipping_cost: shipping, order_discount: discount, ...totals, notes: dto.notes, status: dto.status ?? HireOrderStatus.DRAFT, added_by_id: actorId } as any, { transaction });
      await this.orderItems.bulkCreate(lines.map(line => ({ ...line, hire_order_id: order.uuid })), { transaction });
      return this.orders.findOne({ where: { uuid: order.uuid }, include: orderInclude, transaction });
    });
  }
  async updateOrder(uuid: string, dto: CreateHireOrderDto, actorId?: number) {
    const order = await this.orders.findOne({ where: { uuid }, include: [{ model: ProcurementHireIn, as: 'hireIns' }, { model: ProcurementHireOut, as: 'hireOuts' }, { model: ProcurementHireBill, as: 'bills' }] } as any);
    if (!order) throw new NotFoundException('Hire order not found');
    if ((order as any).hireIns?.length || (order as any).hireOuts?.length || (order as any).bills?.length) throw new BadRequestException('Hire orders with Hire In/Out or bill records cannot be edited');
    if (dto.hire_mode === HireOrderMode.REQUISITION_BASED && !dto.requisition_id) throw new BadRequestException('Approved equipment requisition is required for requisition-based hire');
    if (!(await this.projects.findOne({ where: { uuid: dto.project_id } as any }))) throw new BadRequestException('Selected project does not exist');
    if (!(await this.vendors.findOne({ where: { uuid: dto.vendor_id } as any }))) throw new BadRequestException('Selected vendor does not exist');
    if (dto.site_id && !(await this.sites.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) throw new BadRequestException('Selected site does not belong to selected project');
    if (dto.hire_mode === HireOrderMode.REQUISITION_BASED && !(await this.requisitions.findOne({ where: { uuid: dto.requisition_id, project_id: dto.project_id, status: ProcurementAssetRequisitionStatus.APPROVED, approval_layer: ProcurementAssetRequisitionApprovalLayer.ALL_APPROVALS_COMPLETED } as any }))) throw new BadRequestException('Only approved equipment requisitions belonging to selected project can be used');
    return this.sequelize.transaction(async transaction => {
      const lines = await this.buildOrderItems(dto.items, dto.requisition_id, transaction, uuid);
      const shipping = Number(dto.shipping_cost ?? 0); const discount = Number(dto.order_discount ?? 0); const totals = await this.orderTotals(lines, shipping, discount);
      await order.update({ hire_mode: dto.hire_mode, requisition_id: dto.requisition_id, project_id: dto.project_id, site_id: dto.site_id, vendor_id: dto.vendor_id, hire_from: dto.hire_from, hire_to: dto.hire_to, shipping_cost: shipping, order_discount: discount, ...totals, notes: dto.notes, status: dto.status ?? order.status, updatedBy: actorId === undefined ? undefined : String(actorId) } as any, { transaction });
      await this.orderItems.destroy({ where: { hire_order_id: uuid } as any, transaction });
      await this.orderItems.bulkCreate(lines.map(line => ({ ...line, hire_order_id: uuid })), { transaction });
      return this.orders.findOne({ where: { uuid }, include: orderInclude, transaction });
    });
  }
  async deleteOrder(uuid: string, actorId?: number) {
    const order: any = await this.orders.findOne({ where: { uuid }, include: [{ model: ProcurementHireIn, as: 'hireIns' }, { model: ProcurementHireOut, as: 'hireOuts' }, { model: ProcurementHireBill, as: 'bills' }] }); if (!order) throw new NotFoundException('Hire order not found');
    if (order.hireIns?.length || order.hireOuts?.length || order.bills?.length) throw new BadRequestException('Delete linked Hire In/Out and bill records before deleting this hire order');
    const deletedBy = actorId === undefined ? undefined : String(actorId);
    await this.orderItems.update({ deletedBy } as any, { where: { hire_order_id: uuid } as any }); await this.orderItems.destroy({ where: { hire_order_id: uuid } as any });
    await order.update({ deletedBy } as any); await order.destroy(); return { message: 'Hire order deleted' };
  }
  async restoreOrder(uuid: string) {
    const row = await this.orders.findOne({ where: { uuid }, paranoid: false }); if (!row) throw new NotFoundException('Hire order not found');
    if (!row.deletedAt) throw new BadRequestException('Hire order is not deleted');
    await row.restore(); await this.orderItems.restore({ where: { hire_order_id: uuid } as any }); return this.viewOrder(uuid);
  }

  private async movementTotals(model: any, itemModel: any, orderItemId: string, transaction?: Transaction, excluding?: string) {
    const parentField = model === this.hireIns ? 'hire_in_id' : 'hire_out_id';
    const docs = await model.findAll({ where: { hire_order_id: (await this.orderItems.findOne({ where: { uuid: orderItemId }, transaction }))?.hire_order_id, ...(excluding ? { uuid: { [Op.ne]: excluding } } : {}) }, attributes: ['uuid'], transaction });
    const docsIds = docs.map((doc: any) => doc.uuid); if (!docsIds.length) return 0;
    const lines = await itemModel.findAll({ where: { hire_order_item_id: orderItemId, [parentField]: { [Op.in]: docsIds } }, transaction });
    return lines.reduce((sum: number, line: any) => sum + Number(line.quantity), 0);
  }
  async createHireIn(dto: CreateHireInDto, actorId?: number) {
    return this.sequelize.transaction(async transaction => {
      const order = await this.orders.findOne({ where: { uuid: dto.hire_order_id }, transaction }); if (!order) throw new BadRequestException('Hire order not found');
      if (new Set(dto.items.map(row => row.hire_order_item_id)).size !== dto.items.length) throw new BadRequestException('A hire order item can only appear once per Hire In record');
      const payload: any[] = [];
      for (const line of dto.items) {
        const orderItem = await this.orderItems.findOne({ where: { uuid: line.hire_order_item_id, hire_order_id: order.uuid }, transaction, lock: transaction.LOCK.UPDATE });
        if (!orderItem) throw new BadRequestException('Hire In item does not belong to selected hire order');
        const previous = await this.movementTotals(this.hireIns, this.hireInItems, orderItem.uuid, transaction);
        if (previous + Number(line.quantity) > Number(orderItem.quantity)) throw new BadRequestException(`Received quantity exceeds ordered quantity for ${orderItem.equipment_description}`);
        payload.push({ ...line, condition: line.condition ?? 'good' });
      }
      const record = await this.hireIns.create({ hire_in_no: dto.hire_in_no ?? `HI${Date.now()}`, hire_order_id: order.uuid, received_date: dto.received_date, status: dto.status ?? 'received', notes: dto.notes, received_by_id: actorId } as any, { transaction });
      await this.hireInItems.bulkCreate(payload.map(line => ({ ...line, hire_in_id: record.uuid })), { transaction });
      return this.viewHireIn(record.uuid, transaction);
    });
  }
  async createHireOut(dto: CreateHireOutDto, actorId?: number) {
    return this.sequelize.transaction(async transaction => {
      const order = await this.orders.findOne({ where: { uuid: dto.hire_order_id }, transaction }); if (!order) throw new BadRequestException('Hire order not found');
      if (new Set(dto.items.map(row => row.hire_order_item_id)).size !== dto.items.length) throw new BadRequestException('A hire order item can only appear once per Hire Out record');
      const payload: any[] = [];
      for (const line of dto.items) {
        const orderItem = await this.orderItems.findOne({ where: { uuid: line.hire_order_item_id, hire_order_id: order.uuid }, transaction, lock: transaction.LOCK.UPDATE });
        if (!orderItem) throw new BadRequestException('Hire Out item does not belong to selected hire order');
        const received = await this.movementTotals(this.hireIns, this.hireInItems, orderItem.uuid, transaction);
        const returned = await this.movementTotals(this.hireOuts, this.hireOutItems, orderItem.uuid, transaction);
        if (Number(line.quantity) + returned > received) throw new BadRequestException(`Return quantity exceeds received/on-site quantity for ${orderItem.equipment_description}`);
        payload.push({ ...line, condition: line.condition ?? 'good' });
      }
      const record = await this.hireOuts.create({ hire_out_no: dto.hire_out_no ?? `HOUT${Date.now()}`, hire_order_id: order.uuid, return_date: dto.return_date, status: dto.status ?? 'returned', notes: dto.notes, returned_by_id: actorId } as any, { transaction });
      await this.hireOutItems.bulkCreate(payload.map(line => ({ ...line, hire_out_id: record.uuid })), { transaction });
      return this.viewHireOut(record.uuid, transaction);
    });
  }

  async createBill(dto: CreateHireBillDto, actorId?: number) {
    if (dto.period_to < dto.period_from) throw new BadRequestException('Bill period end must not be before start');
    return this.sequelize.transaction(async transaction => {
      const order = await this.orders.findOne({ where: { uuid: dto.hire_order_id }, include: [{ model: ProcurementHireOrderItem, as: 'items' }], transaction });
      if (!order) throw new BadRequestException('Hire order not found');
      if (![HireOrderStatus.ACTIVE, HireOrderStatus.CLOSED].includes(order.status)) throw new BadRequestException('Bills can only be created from active or closed hire orders');
      const orderLines: any[] = (order as any).items ?? [];
      const selections = dto.items?.length ? dto.items : orderLines.map(line => ({ hire_order_item_id: line.uuid, quantity: Number(line.quantity) }));
      const lines: any[] = [];
      for (const selected of selections) {
        const source = orderLines.find(line => line.uuid === selected.hire_order_item_id);
        if (!source) throw new BadRequestException('Bill line must reference an item from this hire order');
        const quantity = Number(selected.quantity ?? source.quantity); const amount = quantity * Number(source.rate);
        lines.push({ hire_order_item_id: source.uuid, description: source.equipment_description, quantity, rate: source.rate, tax_amount: amount * Number(source.tax_percent) / 100, vat_amount: amount * Number(source.vat_percent) / 100, amount });
      }
      const subtotal = lines.reduce((sum, line) => sum + line.amount, 0); const vat_total = lines.reduce((sum, line) => sum + line.vat_amount, 0); const ait_tds_total = lines.reduce((sum, line) => sum + line.tax_amount, 0);
      const discount = Number(dto.discount ?? 0); const carriage = Number(dto.carriage ?? 0); const net_amount = Math.max(0, subtotal + vat_total - ait_tds_total - discount + carriage);
      const bill = await this.bills.create({ bill_no: dto.bill_no ?? `HB${Date.now()}`, hire_order_id: order.uuid, project_id: order.project_id, vendor_id: order.vendor_id, period_from: dto.period_from, period_to: dto.period_to, subtotal, vat_total, ait_tds_total, discount, carriage, net_amount, status: dto.status ?? 'pending', notes: dto.notes, added_by_id: actorId } as any, { transaction });
      await this.billItems.bulkCreate(lines.map(line => ({ ...line, bill_id: bill.uuid })), { transaction });
      return this.viewBill(bill.uuid, transaction);
    });
  }
  async deleteEntity(kind: 'hireIn' | 'hireOut' | 'bill', uuid: string, actorId?: number) {
    const model: any = kind === 'hireIn' ? this.hireIns : kind === 'hireOut' ? this.hireOuts : this.bills;
    const children: any = kind === 'hireIn' ? this.hireInItems : kind === 'hireOut' ? this.hireOutItems : this.billItems;
    const fk = kind === 'hireIn' ? 'hire_in_id' : kind === 'hireOut' ? 'hire_out_id' : 'bill_id';
    const row = await model.findOne({ where: { uuid } }); if (!row) throw new NotFoundException(`${kind} record not found`);
    if (kind !== 'bill') {
      const ids = (await children.findAll({ where: { [fk]: uuid }, attributes: ['hire_order_item_id'] })).map((item: any) => item.hire_order_item_id);
      if (kind === 'hireIn') for (const id of ids) { const returned = await this.movementTotals(this.hireOuts, this.hireOutItems, id); if (returned > 0) throw new BadRequestException('Cannot delete a Hire In record with already-returned equipment'); }
    }
    await row.update({ deletedBy: actorId === undefined ? undefined : String(actorId) } as any); await children.destroy({ where: { [fk]: uuid } }); await row.destroy(); return { message: `${kind} record deleted` };
  }
  async restoreEntity(kind: 'hireOrder' | 'hireIn' | 'hireOut' | 'bill', uuid: string) {
    const model: any = kind === 'hireOrder' ? this.orders : kind === 'hireIn' ? this.hireIns : kind === 'hireOut' ? this.hireOuts : this.bills;
    const children: any = kind === 'hireOrder' ? this.orderItems : kind === 'hireIn' ? this.hireInItems : kind === 'hireOut' ? this.hireOutItems : this.billItems;
    const fk = kind === 'hireOrder' ? 'hire_order_id' : kind === 'hireIn' ? 'hire_in_id' : kind === 'hireOut' ? 'hire_out_id' : 'bill_id';
    const row = await model.findOne({ where: { uuid }, paranoid: false }); if (!row) throw new NotFoundException(`${kind} record not found`);
    if (!row.deletedAt) throw new BadRequestException(`${kind} record is not deleted`);
    await row.restore(); await children.restore({ where: { [fk]: uuid } });
    if (kind === 'hireOrder') return this.viewOrder(uuid); if (kind === 'hireIn') return this.viewHireIn(uuid); if (kind === 'hireOut') return this.viewHireOut(uuid); return this.viewBill(uuid);
  }
  async onSite(query: QueryEquipmentSiteDto) {
    const orders: any[] = await this.orders.findAll({ where: { project_id: query.project_id, status: { [Op.in]: [HireOrderStatus.ACTIVE, HireOrderStatus.CLOSED] } }, include: [{ model: Site, as: 'site', attributes: ['uuid', 'name', 'location'], required: false }, { model: SupplierAccounts, as: 'vendor', attributes: ['uuid', 'supplierName'] }, { model: ProcurementHireOrderItem, as: 'items', include: [{ model: ProcurementAssetItemEntry, as: 'equipment', attributes: ['uuid', 'name', 'item_code'], required: false }] }] });
    const lines: any[] = orders.flatMap(order => (order.items ?? []).map((item: any) => ({ order, item })));
    const ids = lines.map(({ item }) => item.uuid); if (!ids.length) return { data: [], project_id: query.project_id, total: 0 };
    const [received, returned] = await Promise.all([
      this.hireInItems.findAll({ where: { hire_order_item_id: { [Op.in]: ids } }, include: [{ model: ProcurementHireIn, as: 'hireIn', attributes: ['uuid'], required: true, where: { status: { [Op.ne]: 'cancelled' } } }] }),
      this.hireOutItems.findAll({ where: { hire_order_item_id: { [Op.in]: ids } }, include: [{ model: ProcurementHireOut, as: 'hireOut', attributes: ['uuid'], required: true, where: { status: { [Op.ne]: 'cancelled' } } }] }),
    ]);
    const receivedMap = new Map<string, number>(); const returnedMap = new Map<string, number>();
    for (const row of received as any[]) receivedMap.set(row.hire_order_item_id, (receivedMap.get(row.hire_order_item_id) ?? 0) + Number(row.quantity));
    for (const row of returned as any[]) returnedMap.set(row.hire_order_item_id, (returnedMap.get(row.hire_order_item_id) ?? 0) + Number(row.quantity));
    const data = lines.map(({ order, item }) => ({ source: 'Hire Order', equipment: item.equipment?.name ?? item.equipment_description, equipment_code: item.equipment?.item_code, quantity: (receivedMap.get(item.uuid) ?? 0) - (returnedMap.get(item.uuid) ?? 0), unit: item.unit, location_vendor: order.site?.name ?? order.vendor?.supplierName, ref: order.hire_no, status: (receivedMap.get(item.uuid) ?? 0) > (returnedMap.get(item.uuid) ?? 0) ? 'on_site' : 'not_received', project_id: order.project_id, hire_order_id: order.uuid })).filter(row => row.quantity > 0);
    return { data, project_id: query.project_id, total: data.length };
  }
  async onSiteDropdowns() { return { projects: await this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }) }; }
}
