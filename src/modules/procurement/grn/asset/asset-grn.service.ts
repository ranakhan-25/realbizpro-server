import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { Op, Transaction } from 'sequelize';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { Task } from 'src/database/models/projects/task/pr_task.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';
import { ProcurementAssetGrn, ProcurementAssetGrnApprovalLayer, ProcurementAssetGrnStatus } from 'src/database/models/procurement/grn/pr_asset_grn.model';
import { ProcurementAssetGrnItem } from 'src/database/models/procurement/grn/pr_asset_grn_item.model';
import { AssetGrnItemDto, CreateAssetGrnDto, UpdateAssetGrnDto } from './dto/asset-grn.dto';
import { QueryAssetGrnDto } from './dto/query-asset-grn.dto';

const include = [
  { model: SupplierAccounts, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { model: ProjectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { model: BillingCategory, as: 'titleOfWork', attributes: ['uuid', 'code', 'name'], required: false },
  { model: Task, as: 'task', attributes: ['uuid', 'taskName'], required: false },
  { model: Site, as: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { model: ProcurementAssetCategory, as: 'category', attributes: ['uuid', 'code', 'name'], required: false },
  { model: SysUser, as: 'addedBy', attributes: ['id', 'name'], required: false },
  { model: ProcurementAssetGrnItem, as: 'items', include: [
    { model: ProcurementAssetItemEntry, as: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { model: ProcurementUnit, as: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
];

@Injectable()
export class AssetGrnService {
  constructor(
    @InjectModel(ProcurementAssetGrn) private readonly grnModel: typeof ProcurementAssetGrn,
    @InjectModel(ProcurementAssetGrnItem) private readonly lineModel: typeof ProcurementAssetGrnItem,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplierModel: typeof SupplierAccounts,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectType) private readonly projectTypeModel: typeof ProjectType,
    @InjectModel(BillingCategory) private readonly workModel: typeof BillingCategory,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Site) private readonly siteModel: typeof Site,
    @InjectModel(ProcurementAssetCategory) private readonly categoryModel: typeof ProcurementAssetCategory,
    @InjectModel(ProcurementAssetItemEntry) private readonly itemModel: typeof ProcurementAssetItemEntry,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
    @InjectModel(CategoryAccountMapping) private readonly accountMappingModel: typeof CategoryAccountMapping,
  ) {}

  private async validateRelations(dto: Partial<CreateAssetGrnDto & UpdateAssetGrnDto>) {
    const relations: Array<[keyof CreateAssetGrnDto, any, string]> = [
      ['supplier_id', this.supplierModel, 'Supplier'], ['project_type_id', this.projectTypeModel, 'Project type'],
      ['project_id', this.projectModel, 'Project'], ['title_of_work_id', this.workModel, 'Title/Name of Work'],
      ['task_id', this.taskModel, 'Task'], ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Asset category'],
    ];
    for (const [field, model, label] of relations) {
      const id = dto[field] as string | undefined;
      if (id && !(await model.findOne({ where: { uuid: id } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.project_id && dto.site_id && !(await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) {
      throw new BadRequestException('Selected site does not belong to selected project');
    }
  }

  private async buildLines(inputs: AssetGrnItemDto[], categoryId?: string, transaction?: Transaction) {
    const lines: any[] = [];
    for (const input of inputs) {
      const item = input.item_id
        ? await this.itemModel.findOne({ where: { uuid: input.item_id } as any, include: [{ model: ProcurementUnit, as: 'unit' }], transaction })
        : null;
      if (input.item_id && !item) throw new BadRequestException(`Selected asset item ${input.item_id} does not exist`);
      if (categoryId && item && item.category_id !== categoryId) throw new BadRequestException(`Asset item ${item.item_code} does not belong to selected category`);
      if (!item && (!input.item_code || !input.item_name)) throw new BadRequestException('Each line must reference an asset item or provide item_code and item_name');
      const unitId = input.unit_id ?? item?.unit_id;
      const unit = unitId ? await this.unitModel.findOne({ where: { uuid: unitId } as any, transaction }) : null;
      if (unitId && !unit) throw new BadRequestException(`Selected unit ${unitId} does not exist`);
      const quantity = Number(input.quantity);
      const rate = Number(input.rate);
      lines.push({
        item_id: item?.uuid ?? null,
        item_code: item?.item_code ?? input.item_code,
        item_name: item?.name ?? input.item_name,
        details: input.details,
        unit_id: unit?.uuid ?? null,
        unit: unit?.name ?? input.unit,
        quantity,
        rate,
        amount: Number((quantity * rate).toFixed(2)),
      });
    }
    return lines;
  }

  async findAll(query: QueryAssetGrnDto) {
    const { page = 1, limit = 10, search, date_from, date_to, ...filters } = query;
    const where: any = {};
    for (const key of ['supplier_id', 'project_type_id', 'project_id', 'title_of_work_id', 'task_id', 'site_id', 'category_id', 'ledger_id', 'added_by_id', 'approval_layer', 'status']) {
      if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    }
    if (date_from && date_to) where.date = { [Op.between]: [date_from, date_to] };
    else if (date_from) where.date = { [Op.gte]: date_from };
    else if (date_to) where.date = { [Op.lte]: date_to };
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { reference: { [Op.like]: `%${search}%` } }, { ledger_name: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.grnModel.findAndCountAll({ where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const grn = await this.grnModel.findOne({ where: { uuid } as any, include, transaction });
    if (!grn) throw new NotFoundException(`Asset GRN ${uuid} not found`);
    return grn;
  }

  async create(dto: CreateAssetGrnDto, actorId?: number | string) {
    await this.validateRelations(dto);
    const code = dto.code?.trim() || `AGRN-${randomBytes(5).toString('hex').toUpperCase()}`;
    if (await this.grnModel.findOne({ where: { code } as any })) throw new BadRequestException('Asset GRN code already exists');
    return this.grnModel.sequelize!.transaction(async (transaction) => {
      const lines = await this.buildLines(dto.items, dto.category_id, transaction);
      const { items: _items, ...header } = dto;
      const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
      const discount = Number(dto.discount ?? 0);
      const grandTotal = Math.max(0, subtotal - discount);
      const paid = Number(dto.paid ?? 0);
      if (discount > subtotal) throw new BadRequestException('Discount cannot exceed subtotal');
      if (paid > grandTotal) throw new BadRequestException('Paid amount cannot exceed grand total');
      const grn = await this.grnModel.create({
        ...header,
        code,
        subtotal,
        discount,
        grand_total: grandTotal,
        paid,
        due: grandTotal - paid,
        added_by_id: actorId !== undefined && /^\d+$/.test(String(actorId)) ? Number(actorId) : undefined,
        approval_layer: dto.approval_layer ?? ProcurementAssetGrnApprovalLayer.PENDING,
        status: dto.status ?? ProcurementAssetGrnStatus.PENDING,
        createdBy: actorId === undefined ? undefined : String(actorId),
      } as any, { transaction });
      await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, grn_id: grn.uuid, createdBy: actorId === undefined ? undefined : String(actorId) })), { transaction });
      return this.findOne(grn.uuid, transaction);
    });
  }

  async update(uuid: string, dto: UpdateAssetGrnDto, actorId?: number | string) {
    const current = await this.grnModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`Asset GRN ${uuid} not found`);
    if (current.already_billed) throw new BadRequestException('This asset GRN is already billed and cannot be changed');
    await this.validateRelations({ ...current.get({ plain: true }), ...dto } as any);
    return this.grnModel.sequelize!.transaction(async (transaction) => {
      const { items, ...header } = dto;
      const values: any = { ...header, updatedBy: actorId === undefined ? undefined : String(actorId) };
      if (items !== undefined) {
        const lines = await this.buildLines(items, dto.category_id ?? current.category_id, transaction);
        values.subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
        await this.lineModel.destroy({ where: { grn_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, grn_id: uuid, createdBy: actorId === undefined ? undefined : String(actorId) })), { transaction });
      }
      const subtotal = Number(values.subtotal ?? current.subtotal);
      const discount = Number(dto.discount ?? current.discount);
      const paid = Number(dto.paid ?? current.paid);
      if (discount > subtotal) throw new BadRequestException('Discount cannot exceed subtotal');
      values.discount = discount;
      values.grand_total = Math.max(0, subtotal - discount);
      if (paid > values.grand_total) throw new BadRequestException('Paid amount cannot exceed grand total');
      values.paid = paid;
      values.due = values.grand_total - paid;
      await current.update(values, { transaction });
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string, actorId?: number | string) {
    const grn = await this.grnModel.findOne({ where: { uuid } as any });
    if (!grn) throw new NotFoundException(`Asset GRN ${uuid} not found`);
    if (grn.already_billed) throw new BadRequestException('This asset GRN is already billed and cannot be deleted');
    await grn.update({ deletedBy: actorId === undefined ? undefined : String(actorId) });
    await grn.destroy();
    return { message: `Asset GRN ${uuid} deleted successfully` };
  }

  async dropdowns(projectId?: string, categoryId?: string) {
    const [suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, users, accountMappings] = await Promise.all([
      this.supplierModel.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.projectTypeModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.projectModel.findAll({ attributes: ['uuid', 'code', 'name', 'projectType'], order: [['name', 'ASC']] }),
      this.workModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.taskModel.findAll({ attributes: ['uuid', 'uid', 'taskName'], order: [['taskName', 'ASC']] }),
      this.siteModel.findAll({ where: projectId ? { projectId } as any : {}, attributes: ['uuid', 'projectId', 'code', 'name'], order: [['name', 'ASC']] }),
      this.categoryModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.itemModel.findAll({ where: categoryId ? { category_id: categoryId } as any : {}, attributes: ['uuid', 'category_id', 'unit_id', 'item_code', 'name', 'purchase_price'], include: [{ model: ProcurementUnit, as: 'unit', attributes: ['uuid', 'code', 'name'] }], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
      this.accountMappingModel.findAll({ attributes: ['uuid', 'categoryId', 'inventoryAccountType', 'inventoryAccountGroupCode', 'existingInventoryAccountId', 'consumptionAccountType', 'consumptionAccountGroupCode', 'existingConsumptionAccountId'] }),
    ]);
    const ledgerMap = new Map<string, { id: string; name: string; category_id: string; accountType: string }>();
    for (const mapping of accountMappings) {
      const data = mapping.get({ plain: true }) as any;
      const candidates = [
        { id: data.existingInventoryAccountId || data.inventoryAccountGroupCode, name: data.existingInventoryAccountId || data.inventoryAccountGroupCode, accountType: 'Inventory' },
        { id: data.existingConsumptionAccountId || data.consumptionAccountGroupCode, name: data.existingConsumptionAccountId || data.consumptionAccountGroupCode, accountType: 'Consumption' },
      ];
      for (const ledger of candidates) if (ledger.id) ledgerMap.set(`${ledger.accountType}:${ledger.id}`, { ...ledger, category_id: data.categoryId });
    }
    return { suppliers, ledgers: [...ledgerMap.values()], projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, users };
  }
}
