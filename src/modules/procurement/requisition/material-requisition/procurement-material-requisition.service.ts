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
import { ProcurementMaterialRequisition, ProcurementMaterialRequisitionApprovalLayer, ProcurementMaterialRequisitionStatus } from 'src/database/models/procurement/requisition/pr_material_requisition.model';
import { ProcurementMaterialRequisitionItem } from 'src/database/models/procurement/requisition/pr_material_requisition_item.model';
import { CreateProcurementMaterialRequisitionDto, CreateProcurementMaterialRequisitionItemDto } from './dto/create-procurement-material-requisition.dto';
import { QueryProcurementMaterialRequisitionDto } from './dto/query-procurement-material-requisition.dto';
import { UpdateProcurementMaterialRequisitionDto } from './dto/update-procurement-material-requisition.dto';

const includes = [
  { association: 'company', attributes: ['uuid', 'name'], required: false },
  { association: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'], required: false },
  { association: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'titleOfWork', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'task', attributes: ['uuid', 'taskName'], required: false },
  { association: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'category', attributes: ['uuid', 'code', 'name'], required: false },
  { association: 'addedBy', attributes: ['id', 'name'], required: false },
  { association: 'items', include: [
    { association: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { association: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
];

@Injectable()
export class ProcurementMaterialRequisitionService {
  constructor(
    @InjectModel(ProcurementMaterialRequisition) private readonly requisitionModel: typeof ProcurementMaterialRequisition,
    @InjectModel(ProcurementMaterialRequisitionItem) private readonly lineModel: typeof ProcurementMaterialRequisitionItem,
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
  ) {}

  private async validateRelations(dto: Partial<CreateProcurementMaterialRequisitionDto>) {
    const checks: Array<[keyof CreateProcurementMaterialRequisitionDto, any, string]> = [
      ['company_id', this.companyModel, 'Company'], ['supplier_id', this.supplierModel, 'Supplier'],
      ['project_type_id', this.projectTypeModel, 'Project type'], ['project_id', this.projectModel, 'Project'],
      ['title_of_work_id', this.workModel, 'Title/Name of Work'], ['task_id', this.taskModel, 'Task'],
      ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Category'],
    ];
    for (const [field, model, label] of checks) {
      const value = dto[field] as string | undefined;
      if (value && !(await model.findOne({ where: { uuid: value } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.site_id && dto.project_id && !(await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) throw new BadRequestException('Selected site does not belong to selected project');
    if (dto.added_by_id && !(await this.userModel.findByPk(dto.added_by_id))) throw new BadRequestException('Selected user does not exist');
  }

  private async buildLines(inputs: CreateProcurementMaterialRequisitionItemDto[], categoryId?: string, transaction?: Transaction) {
    const lines: any[] = [];
    for (const input of inputs) {
      let item: ProcurementItemEntry | null = null;
      if (input.item_id) {
        item = await this.itemModel.findOne({ where: { uuid: input.item_id } as any, include: [{ association: 'unit' }], transaction });
        if (!item) throw new BadRequestException(`Selected item ${input.item_id} does not exist`);
        if (categoryId && item.category_id !== categoryId) throw new BadRequestException(`Item ${item.item_code} does not belong to selected category`);
        if (input.item_code !== item.item_code) throw new BadRequestException('Item code does not match selected item');
      }
      const unit = item?.unit ?? (input.unit_id ? await this.unitModel.findOne({ where: { uuid: input.unit_id } as any, transaction }) : null);
      if (input.unit_id && !unit) throw new BadRequestException(`Selected unit ${input.unit_id} does not exist`);
      if (item && input.unit_id && item.unit_id !== input.unit_id) throw new BadRequestException('Selected unit does not match item unit');
      const budgetQty = input.budget_qty ?? 0;
      const purchasedQty = input.already_purchase_qty ?? 0;
      const availableQty = input.available_qty ?? Math.max(0, budgetQty - purchasedQty);
      const demandQty = input.demand_qty;
      const rate = Number(item?.purchase_price ?? 0);
      lines.push({
        item_id: item?.uuid ?? null, unit_id: unit?.uuid ?? null,
        item_code: item?.item_code ?? input.item_code, item_name: item?.name ?? input.item_name,
        details: input.details, unit: unit?.name ?? input.unit,
        budget_qty: budgetQty, already_purchase_qty: purchasedQty, available_qty: availableQty,
        demand_qty: demandQty, stock: input.stock ?? 0, rate,
        amount: Number((demandQty * rate).toFixed(2)),
      });
    }
    return lines;
  }

  async create(dto: CreateProcurementMaterialRequisitionDto, userId?: string) {
    await this.validateRelations(dto);
    return this.requisitionModel.sequelize!.transaction(async (transaction) => {
      const lines = await this.buildLines(dto.items, dto.category_id, transaction);
      const count = await this.requisitionModel.count({ transaction, paranoid: false });
      const total = lines.reduce((sum, line) => sum + line.amount, 0);
      const { items, ...header } = dto;
      const actor = userId
        ? (/^\d+$/.test(userId)
          ? await this.userModel.findByPk(userId, { transaction })
          : await this.userModel.findOne({ where: { uuid: userId } as any, transaction }))
        : null;
      const requisition = await this.requisitionModel.create({
        ...header, code: dto.code || `REC${String(count + 1).padStart(5, '0')}`,
        total, added_by_id: dto.added_by_id ?? actor?.id,
        createdBy: userId, approval_layer: dto.approval_layer ?? ProcurementMaterialRequisitionApprovalLayer.PENDING,
        status: dto.status ?? ProcurementMaterialRequisitionStatus.PENDING,
      } as any, { transaction });
      await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, requisition_id: requisition.uuid, createdBy: userId })), { transaction });
      return this.findOne(requisition.uuid, transaction);
    });
  }

  async findAll(query: QueryProcurementMaterialRequisitionDto) {
    const { page = 1, limit = 10, search, date_from, date_to, ...filters } = query;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    for (const key of ['company_id', 'supplier_id', 'project_type_id', 'project_id', 'title_of_work_id', 'added_by_id', 'approval_layer', 'status']) if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    if (date_from && date_to) where.date = { [Op.between]: [date_from, date_to] };
    else if (date_from) where.date = { [Op.gte]: date_from };
    else if (date_to) where.date = { [Op.lte]: date_to };
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { ref: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.requisitionModel.findAndCountAll({ where, include: includes, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const requisition = await this.requisitionModel.findOne({ where: { uuid } as any, include: includes, transaction });
    if (!requisition) throw new NotFoundException(`Procurement Material Requisition ${uuid} not found`);
    return requisition;
  }

  async update(uuid: string, dto: UpdateProcurementMaterialRequisitionDto, userId?: string) {
    const current = await this.requisitionModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`Procurement Material Requisition ${uuid} not found`);
    await this.validateRelations(dto);
    return this.requisitionModel.sequelize!.transaction(async (transaction) => {
      const { items, ...header } = dto;
      const values: any = { ...header, updatedBy: userId };
      if (items !== undefined) {
        const lines = await this.buildLines(items, dto.category_id ?? current.category_id, transaction);
        values.total = lines.reduce((sum, line) => sum + line.amount, 0);
        await this.lineModel.destroy({ where: { requisition_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, requisition_id: uuid, createdBy: userId })), { transaction });
      }
      await current.update(values, { transaction });
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string, userId?: string) {
    const requisition = await this.requisitionModel.findOne({ where: { uuid } as any });
    if (!requisition) throw new NotFoundException(`Procurement Material Requisition ${uuid} not found`);
    await requisition.update({ deletedBy: userId }); await requisition.destroy();
    return { message: `Procurement Material Requisition ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const requisition = await this.requisitionModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!requisition) throw new NotFoundException(`Procurement Material Requisition ${uuid} not found`);
    if (!requisition.deletedAt) throw new BadRequestException('Requisition is not deleted');
    await requisition.restore(); return this.findOne(uuid);
  }

  async dropdowns(projectId?: string, categoryId?: string) {
    const [companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, users] = await Promise.all([
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
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, boqItems: items, units, users };
  }
}
