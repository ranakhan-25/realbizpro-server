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
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementRfq } from 'src/database/models/procurement/rfq/pr_rfq.model';
import { ProcurementRfqItem } from 'src/database/models/procurement/rfq/pr_rfq_item.model';
import { CreateRfqDto, CreateRfqItemDto } from './dto/create-rfq.dto';
import { QueryRfqDto } from './dto/query-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';

const include = [
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
export class RfqService {
  constructor(
    @InjectModel(ProcurementRfq) private readonly rfqModel: typeof ProcurementRfq,
    @InjectModel(ProcurementRfqItem) private readonly lineModel: typeof ProcurementRfqItem,
    @InjectModel(SysCompany) private readonly companyModel: typeof SysCompany,
    @InjectModel(SysUser) private readonly userModel: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplierModel: typeof SupplierAccounts,
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectType) private readonly projectTypeModel: typeof ProjectType,
    @InjectModel(BillingCategory) private readonly workModel: typeof BillingCategory,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(Site) private readonly siteModel: typeof Site,
    @InjectModel(MaterialRequisition) private readonly requisitionModel: typeof MaterialRequisition,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(ProcurementItemEntry) private readonly itemModel: typeof ProcurementItemEntry,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
  ) {}

  private async validateHeader(dto: Partial<CreateRfqDto>) {
    const checks: Array<[keyof CreateRfqDto, any, string]> = [
      ['company_id', this.companyModel, 'Company'], ['supplier_id', this.supplierModel, 'Supplier'],
      ['project_type_id', this.projectTypeModel, 'Project type'], ['project_id', this.projectModel, 'Project'],
      ['title_of_work_id', this.workModel, 'Title/Name of Work'], ['task_id', this.taskModel, 'Task'],
      ['site_id', this.siteModel, 'Site'], ['category_id', this.categoryModel, 'Category'],
      ['requisition_id', this.requisitionModel, 'Requisition'],
    ];
    for (const [field, model, label] of checks) {
      const value = dto[field] as string | undefined;
      if (value && !(await model.findOne({ where: { uuid: value } as any }))) throw new BadRequestException(`Selected ${label.toLowerCase()} does not exist`);
    }
    if (dto.site_id && dto.project_id) {
      const site = await this.siteModel.findOne({ where: { uuid: dto.site_id, projectId: dto.project_id } as any });
      if (!site) throw new BadRequestException('Selected site does not belong to selected project');
    }
    if (dto.added_by_id && !(await this.userModel.findByPk(dto.added_by_id))) throw new BadRequestException('Selected user does not exist');
  }

  private async buildLines(inputs: CreateRfqItemDto[], categoryId?: string, transaction?: Transaction) {
    const lines: any[] = [];
    for (const input of inputs) {
      const item = await this.itemModel.findOne({ where: { uuid: input.item_id } as any, include: [{ association: 'unit' }], transaction });
      if (!item) throw new BadRequestException(`Selected item ${input.item_id} does not exist`);
      if (categoryId && item.category_id !== categoryId) throw new BadRequestException(`Item ${item.item_code} does not belong to selected category`);
      const unit = item.unit ?? await this.unitModel.findOne({ where: { uuid: item.unit_id } as any, transaction });
      if (!unit) throw new BadRequestException(`Unit for item ${item.item_code} was not found`);
      const rate = input.rate ?? Number(item.purchase_price ?? 0);
      lines.push({
        item_id: item.uuid, unit_id: unit.uuid, item_code: item.item_code, item_name: item.name,
        details: input.details, unit: unit.name, quantity: input.quantity, rate,
        required_qty: input.required_qty ?? input.quantity, purchase_qty: input.purchase_qty ?? 0,
        stock_qty: input.stock_qty ?? 0, amount: Number((input.quantity * rate).toFixed(2)),
      });
    }
    return lines;
  }

  async create(dto: CreateRfqDto) {
    await this.validateHeader(dto);
    return this.rfqModel.sequelize!.transaction(async (transaction) => {
      const lines = await this.buildLines(dto.items, dto.category_id, transaction);
      const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
      const count = await this.rfqModel.count({ transaction });
      const requisition = dto.requisition_id ? await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction }) : null;
      const rfq = await this.rfqModel.create({
        ...dto, code: dto.code || `R-${String(count + 1).padStart(5, '0')}`,
        reference: dto.reference ?? requisition?.code, subtotal, grand_total: subtotal,
      } as any, { transaction });
      await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, rfq_id: rfq.uuid })), { transaction });
      return this.findOne(rfq.uuid, transaction);
    });
  }

  async findAll(query: QueryRfqDto) {
    const { page = 1, limit = 10, search, sortOrder = 'DESC', ...filters } = query;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    for (const key of ['date', 'company_id', 'supplier_id', 'project_id', 'title_of_work_id', 'requisition_id', 'added_by_id']) if ((filters as any)[key] !== undefined) where[key] = (filters as any)[key];
    if (search) where[Op.or] = [{ code: { [Op.like]: `%${search}%` } }, { reference: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.rfqModel.findAndCountAll({ where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['createdAt', sortOrder]] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any, include, transaction });
    if (!rfq) throw new NotFoundException(`RFQ ${uuid} not found`);
    return rfq;
  }

  async update(uuid: string, dto: UpdateRfqDto) {
    const current = await this.rfqModel.findOne({ where: { uuid } as any });
    if (!current) throw new NotFoundException(`RFQ ${uuid} not found`);
    await this.validateHeader(dto);
    return this.rfqModel.sequelize!.transaction(async (transaction) => {
      const values: any = { ...dto }; delete values.items;
      if (dto.items) {
        const lines = await this.buildLines(dto.items, dto.category_id ?? current.category_id, transaction);
        values.subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
        values.grand_total = values.subtotal;
        await this.lineModel.destroy({ where: { rfq_id: uuid } as any, transaction });
        await this.lineModel.bulkCreate(lines.map((line) => ({ ...line, rfq_id: uuid })), { transaction });
      }
      if (dto.requisition_id && !dto.reference) {
        const req = await this.requisitionModel.findOne({ where: { uuid: dto.requisition_id } as any, transaction });
        values.reference = req?.code;
      }
      await current.update(values, { transaction });
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any });
    if (!rfq) throw new NotFoundException(`RFQ ${uuid} not found`);
    await rfq.destroy();
    return { message: `RFQ ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const rfq = await this.rfqModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!rfq) throw new NotFoundException(`RFQ ${uuid} not found`);
    if (!rfq.deletedAt) throw new BadRequestException('RFQ is not deleted');
    await rfq.restore();
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
      this.categoryModel.findAll({ attributes: ['uuid', 'type', 'code', 'name'], order: [['name', 'ASC']] }),
      this.itemModel.findAll({ where: categoryId ? { category_id: categoryId } as any : {}, attributes: ['uuid', 'category_id', 'unit_id', 'item_code', 'name', 'purchase_price'], include: [{ association: 'unit', attributes: ['uuid', 'code', 'name'] }], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.requisitionModel.findAll({ attributes: ['uuid', 'code', 'date', 'projectId'], order: [['createdAt', 'DESC']] }),
      this.userModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projectTypes, projects, titleOfWorks, tasks, sites, categories, items, units, requisitions, users };
  }
}
