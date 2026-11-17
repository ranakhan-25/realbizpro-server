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
import { ProcurementPurchaseOrder } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseOrderItem } from 'src/database/models/procurement/purchase-order/pr_purchase_order_item.model';
import { ProcurementMaterialRequisition } from 'src/database/models/procurement/requisition/pr_material_requisition.model';
import { ProcurementGrn, ProcurementGrnApprovalLayer, ProcurementGrnStatus } from 'src/database/models/procurement/grn/pr_grn.model';
import { ProcurementGrnItem } from 'src/database/models/procurement/grn/pr_grn_item.model';
import { QueryGrnDto } from './dto/query-grn.dto';
import { UpdateGrnDto, UpdateGrnItemDto } from './dto/update-grn.dto';

const includes = [
  { association: 'company', attributes: ['uuid', 'name'], required: false },
  { association: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'], required: false },
  { association: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'titleOfWork', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'task', attributes: ['uuid', 'taskName'], required: false },
  { association: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'category', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'purchaseOrder', attributes: ['uuid', 'code', 'reference'], required: false },
  { association: 'requisition', attributes: ['uuid', 'code'], required: false },
  { association: 'addedBy', attributes: ['id', 'name'], required: false },
  { association: 'items', include: [
    { association: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { association: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
    { association: 'purchaseOrderItem', attributes: ['uuid', 'item_code', 'quantity', 'rate'], required: false },
  ], required: false },
];

@Injectable()
export class GrnService {
  constructor(
    @InjectModel(ProcurementGrn) private readonly grnModel: typeof ProcurementGrn,
    @InjectModel(ProcurementGrnItem) private readonly lineModel: typeof ProcurementGrnItem,
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
    @InjectModel(ProcurementPurchaseOrder) private readonly purchaseOrderModel: typeof ProcurementPurchaseOrder,
    @InjectModel(ProcurementPurchaseOrderItem) private readonly purchaseOrderItemModel: typeof ProcurementPurchaseOrderItem,
    @InjectModel(ProcurementMaterialRequisition) private readonly requisitionModel: typeof ProcurementMaterialRequisition,
  ) {}

  private async validateRelations(dto: Partial<UpdateGrnDto>) {
    const refs: Array<[keyof UpdateGrnDto, any, string]> = [
      ['company_id', this.companyModel, 'Company'], ['supplier_id', this.supplierModel, 'Supplier'],
      ['project_type_id', this.projectTypeModel, 'Project type'], ['project_id', this.projectModel, 'Project'],
      ['title_of_work_id', this.workModel, 'Title/Name of Work'], ['task_id', this.taskModel, 'Task'],
      ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Category'],
      ['purchase_order_id', this.purchaseOrderModel, 'Purchase order'], ['requisition_id', this.requisitionModel, 'Requisition'],
    ];
    for (const [field, model, label] of refs) {
      const uuid = dto[field] as string | undefined;
      if (uuid && !(await model.findOne({ where: { uuid } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.site_id && dto.project_id && !(await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) throw new BadRequestException('Selected site does not belong to selected project');
  }

  private async buildLines(inputs: UpdateGrnItemDto[], categoryId: string | undefined, transaction: Transaction, purchaseOrderId?: string) {
    const result: any[] = [];
    for (const input of inputs) {
      const poLine = input.purchase_order_item_id
        ? await this.purchaseOrderItemModel.findOne({ where: { uuid: input.purchase_order_item_id } as any, include: [{ association: 'purchaseOrder' }], transaction })
        : null;
      if (input.purchase_order_item_id && !poLine) throw new BadRequestException('Selected purchase-order item does not exist');
      if (poLine && purchaseOrderId && poLine.purchase_order_id !== purchaseOrderId) throw new BadRequestException('Purchase-order item does not belong to selected purchase order');
      const itemId = input.item_id ?? poLine?.item_id;
      const item = itemId ? await this.itemModel.findOne({ where: { uuid: itemId } as any, include: [{ association: 'unit' }], transaction }) : null;
      if (itemId && !item) throw new BadRequestException(`Selected item ${itemId} does not exist`);
      if (!item && !input.item_code) throw new BadRequestException('Each GRN line must reference an item or provide an item code');
      if (categoryId && item && item.category_id !== categoryId) throw new BadRequestException(`Item ${item.item_code} does not belong to selected category`);
      const unitId = input.unit_id ?? item?.unit_id;
      const unit = unitId ? await this.unitModel.findOne({ where: { uuid: unitId } as any, transaction }) : null;
      if (unitId && !unit) throw new BadRequestException(`Selected unit ${unitId} does not exist`);
      const quantity = input.quantity ?? 0;
      const rate = input.rate ?? Number(poLine?.rate ?? item?.purchase_price ?? 0);
      result.push({
        purchase_order_item_id: poLine?.uuid ?? input.purchase_order_item_id ?? null,
        item_id: item?.uuid ?? null, unit_id: unit?.uuid ?? null,
        item_code: item?.item_code ?? input.item_code, item_name: item?.name ?? input.item_name ?? input.item_code,
        details: input.details, unit: unit?.name ?? input.unit, quantity, rate,
        budget_qty: input.budget_qty ?? 0, purchase_qty: input.purchase_qty ?? 0,
        stock_qty: input.stock_qty ?? 0, amount: Number((quantity * rate).toFixed(2)),
      });
    }
    return result;
  }

  async findAll(query: QueryGrnDto) {
    const { page = 1, limit = 10, search, date_from, date_to, already_billed, withDeleted, deleted_only, ...filters } = query as any;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    for (const key of ['company_id', 'supplier_id', 'project_type_id', 'project_id', 'title_of_work_id', 'task_id', 'added_by_id', 'approval_layer', 'status']) if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    if (date_from && date_to) where.date = { [Op.between]: [date_from, date_to] };
    else if (date_from) where.date = { [Op.gte]: date_from };
    else if (date_to) where.date = { [Op.lte]: date_to };
    if (already_billed !== undefined) where.already_billed = already_billed === 'true' || already_billed === true;
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { reference: { [Op.like]: `%${search}%` } }];

    let paranoid = true;
    if (deleted_only === 'true' || deleted_only === true) {
      where.deletedAt = { [Op.ne]: null };
      paranoid = false;
    } else if (withDeleted === 'true' || withDeleted === true) {
      paranoid = false;
    }

    const { rows, count } = await this.grnModel.findAndCountAll({ where, paranoid, include: includes, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const grn = await this.grnModel.findOne({ where: { uuid } as any, include: includes, transaction });
    if (!grn) throw new NotFoundException(`GRN ${uuid} not found`);
    return grn;
  }

  async update(uuid: string, dto: UpdateGrnDto, actorId?: string | number) {
    const current = await this.grnModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`GRN ${uuid} not found`);
    if (current.already_billed) throw new BadRequestException('This GRN is already billed and cannot be edited');
    await this.validateRelations(dto);
    return this.grnModel.sequelize!.transaction(async (transaction) => {
      const { items, ...header } = dto;
      const values: any = { ...header, updatedBy: actorId === undefined ? undefined : String(actorId) };
      if (items !== undefined) {
        const lines = await this.buildLines(items, dto.category_id ?? current.category_id, transaction, dto.purchase_order_id ?? current.purchase_order_id);
        const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
        const discount = dto.discount ?? Number(current.discount);
        const grandTotal = Math.max(0, subtotal - discount);
        const paid = dto.paid ?? Number(current.paid);
        if (discount > subtotal) throw new BadRequestException('Discount cannot exceed subtotal');
        if (paid > grandTotal) throw new BadRequestException('Paid amount cannot exceed grand total');
        values.subtotal = subtotal; values.discount = discount; values.grand_total = grandTotal; values.paid = paid; values.due = grandTotal - paid;
        await this.lineModel.destroy({ where: { grn_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, grn_id: uuid, createdBy: actorId === undefined ? undefined : String(actorId) })), { transaction });
      } else if (dto.discount !== undefined || dto.paid !== undefined) {
        const discount = dto.discount ?? Number(current.discount);
        const subtotal = Number(current.subtotal);
        const grandTotal = Math.max(0, subtotal - discount);
        const paid = dto.paid ?? Number(current.paid);
        if (discount > subtotal) throw new BadRequestException('Discount cannot exceed subtotal');
        if (paid > grandTotal) throw new BadRequestException('Paid amount cannot exceed grand total');
        values.discount = discount; values.grand_total = grandTotal; values.due = grandTotal - paid;
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
    const grn = await this.grnModel.findOne({ where: { uuid } as any });
    if (!grn) throw new NotFoundException(`GRN ${uuid} not found`);
    if (grn.already_billed) throw new BadRequestException('This GRN is already billed and cannot be deleted');
    await grn.update({ deletedBy: actorId === undefined ? undefined : String(actorId) });
    await grn.destroy();
    return { message: `GRN ${uuid} deleted successfully` };
  }

  async dropdowns(projectId?: string, categoryId?: string) {
    const [companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, purchaseOrders, requisitions, users] = await Promise.all([
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
      this.purchaseOrderModel.findAll({ attributes: ['uuid', 'code', 'reference', 'supplier_id', 'project_id'], order: [['createdAt', 'DESC']] }),
      this.requisitionModel.findAll({ attributes: ['uuid', 'code', 'project_id', 'date'], order: [['createdAt', 'DESC']] }),
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, purchaseOrders, requisitions, users };
  }
}
