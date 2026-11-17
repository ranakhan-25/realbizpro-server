import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { Task } from 'src/database/models/projects/task/pr_task.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementMaterialRequisition } from 'src/database/models/procurement/requisition/pr_material_requisition.model';
import { ProcurementPurchaseOrder, ProcurementPurchaseOrderApprovalLayer, ProcurementPurchaseOrderStatus } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseOrderItem } from 'src/database/models/procurement/purchase-order/pr_purchase_order_item.model';
import { CreatePurchaseOrderDto, CreatePurchaseOrderItemDto } from './dto/create-purchase-order.dto';
import { QueryPurchaseOrderDto } from './dto/query-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

const associations = [
  { association: 'company', attributes: ['uuid', 'name'], required: false },
  { association: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { association: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'titleOfWork', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'task', attributes: ['uuid', 'taskName'], required: false },
  { association: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'category', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'requisition', attributes: ['uuid', 'code'], required: false },
  { association: 'addedBy', attributes: ['id', 'name'], required: false },
  { association: 'items', include: [
    { association: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { association: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
];

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectModel(ProcurementPurchaseOrder) private readonly orderModel: typeof ProcurementPurchaseOrder,
    @InjectModel(ProcurementPurchaseOrderItem) private readonly lineModel: typeof ProcurementPurchaseOrderItem,
    @InjectModel(SysCompany) private readonly companyModel: typeof SysCompany,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplierModel: typeof SupplierAccounts,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectType) private readonly projectTypeModel: typeof ProjectType,
    @InjectModel(BillingCategory) private readonly workModel: typeof BillingCategory,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Site) private readonly siteModel: typeof Site,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(ProcurementItemEntry) private readonly itemModel: typeof ProcurementItemEntry,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
    @InjectModel(ProcurementMaterialRequisition) private readonly requisitionModel: typeof ProcurementMaterialRequisition,
  ) {}

  private async validateRelations(dto: Partial<CreatePurchaseOrderDto>) {
    const refs: Array<[keyof CreatePurchaseOrderDto, any, string]> = [
      ['company_id', this.companyModel, 'Company'], ['supplier_id', this.supplierModel, 'Supplier'],
      ['project_type_id', this.projectTypeModel, 'Project type'], ['project_id', this.projectModel, 'Project'],
      ['title_of_work_id', this.workModel, 'Title/Name of Work'], ['task_id', this.taskModel, 'Task'],
      ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Category'],
      ['requisition_id', this.requisitionModel, 'Material requisition'],
    ];
    for (const [field, model, label] of refs) {
      const uuid = dto[field] as string | undefined;
      if (uuid && !(await model.findOne({ where: { uuid } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.site_id && dto.project_id && !(await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) throw new BadRequestException('Selected site does not belong to selected project');
    if (dto.added_by_id && !(await this.userModel.findByPk(dto.added_by_id))) throw new BadRequestException('Selected user does not exist');
  }

  private async buildLines(items: CreatePurchaseOrderItemDto[], categoryId?: string, transaction?: Transaction) {
    const result: any[] = [];
    for (const input of items) {
      const item = await this.itemModel.findOne({ where: { uuid: input.item_id } as any, include: [{ association: 'unit' }], transaction });
      if (!item) throw new BadRequestException(`Selected item ${input.item_id} does not exist`);
      if (categoryId && item.category_id !== categoryId) throw new BadRequestException(`Item ${item.item_code} does not belong to selected category`);
      const unit = item.unit ?? await this.unitModel.findOne({ where: { uuid: item.unit_id } as any, transaction });
      if (!unit) throw new BadRequestException(`Unit for item ${item.item_code} was not found`);
      const rate = input.rate ?? Number(item.purchase_price ?? 0);
      result.push({ item_id: item.uuid, unit_id: unit.uuid, item_code: item.item_code, item_name: item.name, details: input.details, unit: unit.name, quantity: input.quantity, rate, budget_qty: input.budget_qty ?? 0, purchase_qty: input.purchase_qty ?? 0, stock_qty: input.stock_qty ?? 0, amount: Number((input.quantity * rate).toFixed(2)) });
    }
    return result;
  }

  private async resolveActor(actorId: string | number | undefined, transaction: Transaction) {
    if (actorId === undefined) return null;
    return /^\d+$/.test(String(actorId)) ? this.userModel.findByPk(actorId, { transaction }) : this.userModel.findOne({ where: { uuid: String(actorId) } as any, transaction });
  }

  async create(dto: CreatePurchaseOrderDto, actorId?: string | number) {
    await this.validateRelations(dto);
    return this.orderModel.sequelize!.transaction(async (transaction) => {
      const lines = await this.buildLines(dto.items, dto.category_id, transaction);
      const count = await this.orderModel.count({ transaction, paranoid: false });
      const total = lines.reduce((sum, line) => sum + line.amount, 0);
      const requisition = dto.requisition_id ? await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction }) : null;
      const actor = await this.resolveActor(actorId, transaction);
      const { items, ...header } = dto;
      const order = await this.orderModel.create({
        ...header, code: dto.code || `PO${String(count + 1).padStart(5, '0')}`,
        reference: dto.reference ?? requisition?.code, subtotal: total, grand_total: total,
        added_by_id: dto.added_by_id ?? actor?.id,
        createdBy: actorId === undefined ? undefined : String(actorId),
        approval_layer: dto.approval_layer ?? ProcurementPurchaseOrderApprovalLayer.PENDING,
        status: dto.status ?? ProcurementPurchaseOrderStatus.PENDING,
      } as any, { transaction });
      await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, purchase_order_id: order.uuid, createdBy: actorId === undefined ? undefined : String(actorId) })), { transaction });
      return this.findOne(order.uuid, transaction);
    });
  }

  async findAll(query: QueryPurchaseOrderDto) {
    const { page = 1, limit = 10, search, date_from, date_to, ...filters } = query;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    for (const key of ['company_id', 'supplier_id', 'project_type_id', 'project_id', 'title_of_work_id', 'task_id', 'added_by_id', 'approval_layer', 'status']) if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    if (date_from && date_to) where.date = { [Op.between]: [date_from, date_to] };
    else if (date_from) where.date = { [Op.gte]: date_from };
    else if (date_to) where.date = { [Op.lte]: date_to };
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { reference: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.orderModel.findAndCountAll({ where, include: associations, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const order = await this.orderModel.findOne({ where: { uuid } as any, include: associations, transaction });
    if (!order) throw new NotFoundException(`Purchase Order ${uuid} not found`);
    return order;
  }

  async update(uuid: string, dto: UpdatePurchaseOrderDto, actorId?: string | number) {
    const current = await this.orderModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`Purchase Order ${uuid} not found`);
    await this.validateRelations(dto);
    return this.orderModel.sequelize!.transaction(async (transaction) => {
      const { items, ...header } = dto;
      const values: any = { ...header, updatedBy: actorId === undefined ? undefined : String(actorId) };
      if (items !== undefined) {
        const lines = await this.buildLines(items, dto.category_id ?? current.category_id, transaction);
        values.subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
        values.grand_total = values.subtotal;
        await this.lineModel.destroy({ where: { purchase_order_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, purchase_order_id: uuid, createdBy: actorId === undefined ? undefined : String(actorId) })), { transaction });
      }
      if (dto.requisition_id && !dto.reference) {
        const requisition = await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction });
        values.reference = requisition?.code;
      }
      await current.update(values, { transaction });
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string, actorId?: string | number) {
    const order = await this.orderModel.findOne({ where: { uuid } as any });
    if (!order) throw new NotFoundException(`Purchase Order ${uuid} not found`);
    await order.update({ deletedBy: actorId === undefined ? undefined : String(actorId) });
    await order.destroy();
    return { message: `Purchase Order ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const order = await this.orderModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!order) throw new NotFoundException(`Purchase Order ${uuid} not found`);
    if (!order.deletedAt) throw new BadRequestException('Purchase Order is not deleted');
    await order.restore();
    return this.findOne(uuid);
  }

  async dropdowns(projectId?: string, categoryId?: string) {
    const [companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, requisitions, users] = await Promise.all([
      this.companyModel.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.supplierModel.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.projectTypeModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.projectModel.findAll({ attributes: ['uuid', 'code', 'name', 'projectType'], order: [['name', 'ASC']] }),
      this.workModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.taskModel.findAll({ attributes: ['uuid', 'uid', 'taskName'], order: [['taskName', 'ASC']] }),
      this.siteModel.findAll({ where: projectId ? { projectId } as any : {}, attributes: ['uuid', 'projectId', 'code', 'name'], order: [['name', 'ASC']] }),
      this.categoryModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.itemModel.findAll({ where: categoryId ? { category_id: categoryId } as any : {}, attributes: ['uuid', 'category_id', 'unit_id', 'item_code', 'name', 'purchase_price'], include: [{ association: 'unit', attributes: ['uuid', 'code', 'name'] }], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.requisitionModel.findAll({ attributes: ['uuid', 'code', 'project_id', 'date'], order: [['createdAt', 'DESC']] }),
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, boqItems: items, units, requisitions, users };
  }
}
