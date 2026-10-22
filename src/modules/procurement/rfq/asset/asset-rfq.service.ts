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
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementAssetRfq } from 'src/database/models/procurement/rfq/pr_asset_rfq.model';
import { ProcurementAssetRfqItem } from 'src/database/models/procurement/rfq/pr_asset_rfq_item.model';
import { CreateAssetRfqDto, CreateAssetRfqItemDto } from './dto/create-asset-rfq.dto';
import { QueryAssetRfqDto } from './dto/query-asset-rfq.dto';
import { UpdateAssetRfqDto } from './dto/update-asset-rfq.dto';

const include = [
  { model: SysCompany, as: 'company', attributes: ['uuid', 'name'], required: false },
  { model: SupplierAccounts, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { model: ProjectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { model: BillingCategory, as: 'titleOfWork', attributes: ['uuid', 'code', 'name'], required: false },
  { model: Task, as: 'task', attributes: ['uuid', 'taskName'], required: false },
  { model: Site, as: 'site', attributes: ['uuid', 'code', 'name'], required: false },
  { model: ProcurementAssetCategory, as: 'category', attributes: ['uuid', 'code', 'name'], required: false },
  { model: MaterialRequisition, as: 'requisition', attributes: ['uuid', 'code'], required: false },
  { model: SysUser, as: 'addedBy', attributes: ['id', 'name'], required: false },
  { model: ProcurementAssetRfqItem, as: 'items', include: [
    { model: ProcurementAssetItemEntry, as: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { model: ProcurementUnit, as: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
];

@Injectable()
export class AssetRfqService {
  constructor(
    @InjectModel(ProcurementAssetRfq) private readonly rfqModel: typeof ProcurementAssetRfq,
    @InjectModel(ProcurementAssetRfqItem) private readonly lineModel: typeof ProcurementAssetRfqItem,
    @InjectModel(SysCompany) private readonly companyModel: typeof SysCompany,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplierModel: typeof SupplierAccounts,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectType) private readonly projectTypeModel: typeof ProjectType,
    @InjectModel(BillingCategory) private readonly workModel: typeof BillingCategory,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Site) private readonly siteModel: typeof Site,
    @InjectModel(MaterialRequisition) private readonly requisitionModel: typeof MaterialRequisition,
    @InjectModel(ProcurementAssetCategory) private readonly categoryModel: typeof ProcurementAssetCategory,
    @InjectModel(ProcurementAssetItemEntry) private readonly itemModel: typeof ProcurementAssetItemEntry,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
  ) {}

  private async validateHeader(dto: Partial<CreateAssetRfqDto>) {
    const checks: Array<[keyof CreateAssetRfqDto, any, string]> = [
      ['company_id', this.companyModel, 'Company'], ['supplier_id', this.supplierModel, 'Supplier'],
      ['project_type_id', this.projectTypeModel, 'Project type'], ['project_id', this.projectModel, 'Project'],
      ['title_of_work_id', this.workModel, 'Title/Name of Work'], ['task_id', this.taskModel, 'Task'],
      ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Asset category'],
      ['requisition_id', this.requisitionModel, 'Requisition'],
    ];
    for (const [field, model, label] of checks) {
      const value = dto[field] as string | undefined;
      if (value && !(await model.findOne({ where: { uuid: value } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.site_id && dto.project_id && !(await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any }))) {
      throw new BadRequestException('Selected site does not belong to selected project');
    }
    if (dto.added_by_id && !(await this.userModel.findByPk(dto.added_by_id))) throw new BadRequestException('Selected user does not exist');
  }

  private async buildLines(inputs: CreateAssetRfqItemDto[], categoryId?: string, transaction?: Transaction) {
    const lines: any[] = [];
    for (const input of inputs) {
      const item = await this.itemModel.findOne({ where: { uuid: input.item_id } as any, include: [{ model: ProcurementUnit, as: 'unit' }], transaction });
      if (!item) throw new BadRequestException(`Selected asset item ${input.item_id} does not exist`);
      if (categoryId && item.category_id !== categoryId) throw new BadRequestException(`Asset item ${item.item_code} does not belong to selected asset category`);
      const unit = item.unit ?? await this.unitModel.findOne({ where: { uuid: item.unit_id } as any, transaction });
      if (!unit) throw new BadRequestException(`Unit for asset item ${item.item_code} was not found`);
      const rate = input.rate ?? Number(item.purchase_price ?? 0);
      lines.push({ item_id: item.uuid, unit_id: unit.uuid, item_code: item.item_code, item_name: item.name, details: input.details, unit: unit.name, quantity: input.quantity, rate, required_qty: input.required_qty ?? input.quantity, purchase_qty: input.purchase_qty ?? 0, stock_qty: input.stock_qty ?? 0, amount: Number((input.quantity * rate).toFixed(2)) });
    }
    return lines;
  }

  async create(dto: CreateAssetRfqDto) {
    await this.validateHeader(dto);
    return this.rfqModel.sequelize!.transaction(async (transaction) => {
      const lines = await this.buildLines(dto.items, dto.category_id, transaction);
      const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
      const count = await this.rfqModel.count({ transaction });
      const requisition = dto.requisition_id ? await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction }) : null;
      const rfq = await this.rfqModel.create({ ...dto, code: dto.code || `PUR${String(count + 1).padStart(7, '0')}`, reference: dto.reference ?? requisition?.code, subtotal, grand_total: subtotal } as any, { transaction });
      await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, rfq_id: rfq.uuid })), { transaction });
      return this.findOne(rfq.uuid, transaction);
    });
  }

  async findAll(query: QueryAssetRfqDto) {
    const { page = 1, limit = 10, search, sortOrder = 'DESC', ...filters } = query;
    const where: any = {};
    for (const key of ['date', 'company_id', 'supplier_id', 'project_id', 'title_of_work_id', 'requisition_id', 'added_by_id']) if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { reference: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.rfqModel.findAndCountAll({ where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', sortOrder]] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any, include, transaction });
    if (!rfq) throw new NotFoundException(`Asset RFQ ${uuid} not found`);
    return rfq;
  }

  async update(uuid: string, dto: UpdateAssetRfqDto) {
    const current = await this.rfqModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`Asset RFQ ${uuid} not found`);
    await this.validateHeader(dto);
    return this.rfqModel.sequelize!.transaction(async (transaction) => {
      const values: any = { ...dto }; delete values.items;
      if (dto.items) {
        const lines = await this.buildLines(dto.items, dto.category_id ?? current.category_id, transaction);
        values.subtotal = lines.reduce((sum, line) => sum + line.amount, 0); values.grand_total = values.subtotal;
        await this.lineModel.destroy({ where: { rfq_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, rfq_id: uuid })), { transaction });
      }
      if (dto.requisition_id && !dto.reference) {
        const req = await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction }); values.reference = req?.code;
      }
      await current.update(values, { transaction }); return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any });
    if (!rfq) throw new NotFoundException(`Asset RFQ ${uuid} not found`);
    await rfq.destroy(); return { message: `Asset RFQ ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!rfq) throw new NotFoundException(`Asset RFQ ${uuid} not found`);
    if (!rfq.deletedAt) throw new BadRequestException('Asset RFQ is not deleted');
    await rfq.restore(); return this.findOne(uuid);
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
      this.itemModel.findAll({ where: categoryId ? { category_id: categoryId } as any : {}, attributes: ['uuid', 'category_id', 'unit_id', 'item_code', 'name', 'purchase_price'], include: [{ model: ProcurementUnit, as: 'unit', attributes: ['uuid', 'code', 'name'] }], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.requisitionModel.findAll({ attributes: ['uuid', 'code', 'date', 'projectId'], order: [['createdAt', 'DESC']] }),
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, requisitions, users };
  }
}
