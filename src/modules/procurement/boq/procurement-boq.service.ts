import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProcurementBoq, ProcurementBoqStatus } from 'src/database/models/procurement/boq/pr_procurement_boq.model';
import { ProcurementBoqCostType, ProcurementBoqItem } from 'src/database/models/procurement/boq/pr_procurement_boq_item.model';
import { ProcurementBoqNote } from 'src/database/models/procurement/boq/pr_procurement_boq_note.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CreateProcurementBoqDto, ImportProcurementBoqDto, ProcurementBoqItemDto, QueryProcurementBoqDto } from './dto/procurement-boq.dto';

const include: any[] = [
  { association: 'project', attributes: ['uuid', 'code', 'name'] },
  { association: 'company', attributes: ['uuid', 'name'], required: false },
  { association: 'responsibleUser', attributes: ['id', 'name'], required: false },
  { association: 'addedBy', attributes: ['id', 'name'], required: false },
  { association: 'items', include: [
    { association: 'item', attributes: ['uuid', 'item_code', 'name'], required: false },
    { association: 'category', attributes: ['uuid', 'code', 'name'], required: false },
    { association: 'unitRelation', attributes: ['uuid', 'code', 'name'], required: false },
  ] },
  { association: 'importantNotes' },
];
const costTypes = Object.values(ProcurementBoqCostType);

@Injectable()
export class ProcurementBoqService {
  constructor(
    @InjectModel(ProcurementBoq) private readonly boq: typeof ProcurementBoq,
    @InjectModel(ProcurementBoqItem) private readonly itemLine: typeof ProcurementBoqItem,
    @InjectModel(ProcurementBoqNote) private readonly noteModel: typeof ProcurementBoqNote,
    @InjectModel(Project) private readonly project: typeof Project,
    @InjectModel(SysCompany) private readonly company: typeof SysCompany,
    @InjectModel(SysUser) private readonly user: typeof SysUser,
    @InjectModel(Category) private readonly category: typeof Category,
    @InjectModel(ProcurementItemEntry) private readonly item: typeof ProcurementItemEntry,
    @InjectModel(ProcurementUnit) private readonly unit: typeof ProcurementUnit,
    private readonly sequelize: Sequelize,
  ) {}

  async list(query: QueryProcurementBoqDto) {
    const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    if (query.project_id) where.project_id = query.project_id;
    if (query.company_id) where.company_id = query.company_id;
    if (query.status) where.status = query.status;
    if (query.date_from || query.date_to) where.date = { ...(query.date_from ? { [Op.gte]: query.date_from } : {}), ...(query.date_to ? { [Op.lte]: query.date_to } : {}) };
    if (query.search) where[Op.or] = [{ title: { [Op.iLike]: `%${query.search}%` } }, { '$project.name$': { [Op.iLike]: `%${query.search}%` } }, { '$project.code$': { [Op.iLike]: `%${query.search}%` } }];
    const result = await this.boq.findAndCountAll({ where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['date', 'DESC'], ['createdAt', 'DESC']] });
    return { data: result.rows, total: result.count, page, limit, totalPages: Math.ceil(result.count / limit) };
  }

  async dropdowns() {
    const [projects, companies, users, categories, items, units] = await Promise.all([
      this.project.findAll({ attributes: ['uuid', 'code', 'name', 'projectType'], order: [['name', 'ASC']] }),
      this.company.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.user.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
      this.category.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.item.findAll({ attributes: ['uuid', 'item_code', 'name', 'category_id', 'unit_id'], include: [{ association: 'unit', attributes: ['uuid', 'code', 'name'], required: false }], order: [['name', 'ASC']] }),
      this.unit.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { projects, companies, responsibleUsers: users, categories, items, units, boqTypes: ['standard', 'material', 'labour', 'equipment', 'subcontract'], costTypes, statuses: Object.values(ProcurementBoqStatus) };
  }

  async view(uuid: string, transaction?: Transaction) {
    const row = await this.boq.findOne({ where: { uuid }, include, transaction });
    if (!row) throw new NotFoundException(`Procurement BOQ ${uuid} not found`);
    return row;
  }

  private async validateRelations(dto: CreateProcurementBoqDto) {
    if (!(await this.project.findOne({ where: { uuid: dto.project_id } as any }))) throw new BadRequestException('Selected project does not exist');
    if (dto.company_id && !(await this.company.findOne({ where: { uuid: dto.company_id } as any }))) throw new BadRequestException('Selected company does not exist');
    if (dto.responsible_user_id && !(await this.user.findOne({ where: { id: dto.responsible_user_id } as any }))) throw new BadRequestException('Selected responsible person does not exist');
  }

  private async prepareItems(inputs: ProcurementBoqItemDto[], transaction: Transaction) {
    const lines: any[] = [];
    for (const [index, input] of inputs.entries()) {
      const product = input.item_id ? await this.item.findOne({ where: { uuid: input.item_id } as any, include: [{ association: 'unit' }], transaction }) : null;
      if (input.item_id && !product) throw new BadRequestException(`Selected item ${input.item_id} does not exist`);
      const categoryId = input.category_id ?? product?.category_id;
      if (input.category_id && !(await this.category.findOne({ where: { uuid: input.category_id } as any, transaction }))) throw new BadRequestException('Selected category does not exist');
      if (categoryId && product && product.category_id !== categoryId) throw new BadRequestException(`${product.name} does not belong to selected category`);
      const unitId = input.unit_id ?? product?.unit_id;
      const unit = unitId ? await this.unit.findOne({ where: { uuid: unitId } as any, transaction }) : null;
      if (unitId && !unit) throw new BadRequestException('Selected unit does not exist');
      const unitName = input.unit ?? unit?.name;
      if (!unitName) throw new BadRequestException(`Unit is required for BOQ item ${input.item_name}`);
      const quantity = Number(input.quantity); const rate = Number(input.rate);
      lines.push({ item_id: product?.uuid ?? null, category_id: categoryId ?? null, unit_id: unit?.uuid ?? null, item_name: product?.name ?? input.item_name, item_code: product?.item_code ?? input.item_code ?? null, unit: unitName, quantity, rate, amount: quantity * rate, cost_type: input.cost_type ?? ProcurementBoqCostType.MATERIAL, remarks: input.remarks, sort_order: index });
    }
    return lines;
  }

  private summaries(lines: any[], margin: number) {
    const amount = (type: ProcurementBoqCostType) => lines.filter(line => line.cost_type === type).reduce((sum, line) => sum + Number(line.amount), 0);
    const material_cost = amount(ProcurementBoqCostType.MATERIAL); const equipment_misc_cost = amount(ProcurementBoqCostType.EQUIPMENT_MISC);
    const labour_cost = amount(ProcurementBoqCostType.LABOUR); const subcontract_cost = amount(ProcurementBoqCostType.SUBCONTRACT);
    const subtotal = material_cost + equipment_misc_cost + labour_cost + subcontract_cost;
    return { material_cost, equipment_misc_cost, labour_cost, subcontract_cost, subtotal, margin_overhead: margin, grand_total: subtotal + margin };
  }

  private async persistChildren(boqUuid: string, lines: any[], notes: string[], transaction: Transaction) {
    await this.itemLine.bulkCreate(lines.map(line => ({ ...line, boq_id: boqUuid })), { transaction });
    await this.noteModel.bulkCreate(notes.map((note, sort_order) => ({ boq_id: boqUuid, note, sort_order })), { transaction });
  }

  async create(dto: CreateProcurementBoqDto, actorId?: number) {
    await this.validateRelations(dto);
    return this.sequelize.transaction(async transaction => {
      const lines = await this.prepareItems(dto.items, transaction); const totals = this.summaries(lines, Number(dto.margin_overhead ?? 0));
      const boq = await this.boq.create({ project_id: dto.project_id, company_id: dto.company_id, responsible_user_id: dto.responsible_user_id, responsible_person: dto.responsible_person, title: dto.title, date: dto.date, due_date: dto.due_date, boq_type: dto.boq_type, status: dto.status ?? ProcurementBoqStatus.PENDING, remarks: dto.remarks, added_by_id: actorId, ...totals } as any, { transaction });
      await this.persistChildren(boq.uuid, lines, (dto.important_notes ?? []).map(x => x.note), transaction);
      return this.view(boq.uuid, transaction);
    });
  }

  async update(uuid: string, dto: CreateProcurementBoqDto, actorId?: number) {
    await this.validateRelations(dto);
    return this.sequelize.transaction(async transaction => {
      const boq = await this.boq.findOne({ where: { uuid }, transaction }); if (!boq) throw new NotFoundException(`Procurement BOQ ${uuid} not found`);
      const lines = await this.prepareItems(dto.items, transaction); const totals = this.summaries(lines, Number(dto.margin_overhead ?? 0));
      await boq.update({ project_id: dto.project_id, company_id: dto.company_id, responsible_user_id: dto.responsible_user_id, responsible_person: dto.responsible_person, title: dto.title, date: dto.date, due_date: dto.due_date, boq_type: dto.boq_type, status: dto.status ?? boq.status, remarks: dto.remarks, updatedBy: actorId === undefined ? undefined : String(actorId), ...totals }, { transaction });
      await this.itemLine.destroy({ where: { boq_id: uuid }, transaction }); await this.noteModel.destroy({ where: { boq_id: uuid }, transaction });
      await this.persistChildren(uuid, lines, (dto.important_notes ?? []).map(x => x.note), transaction);
      return this.view(uuid, transaction);
    });
  }

  async remove(uuid: string, actorId?: number) {
    return this.sequelize.transaction(async transaction => {
      const boq = await this.boq.findOne({ where: { uuid }, transaction }); if (!boq) throw new NotFoundException(`Procurement BOQ ${uuid} not found`);
      const deletedBy = actorId === undefined ? undefined : String(actorId);
      await this.itemLine.update({ deletedBy } as any, { where: { boq_id: uuid }, transaction }); await this.itemLine.destroy({ where: { boq_id: uuid }, transaction });
      await this.noteModel.destroy({ where: { boq_id: uuid }, transaction }); await boq.update({ deletedBy }, { transaction }); await boq.destroy({ transaction });
      return { message: `Procurement BOQ ${uuid} deleted successfully` };
    });
  }

  async importRows(dto: ImportProcurementBoqDto, imported: any[], actorId?: number) {
    if (!imported.length) throw new BadRequestException('The uploaded Excel file contains no BOQ rows');
    const nonEmptyRows = imported.filter(row => Object.values(row).some(value => String(value ?? '').trim() !== ''));
    const itemRows: ProcurementBoqItemDto[] = nonEmptyRows.map((row, index) => {
      const normalized: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) normalized[key.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')] = value;
      const item_name = String(normalized.item ?? normalized.item_name ?? normalized.name ?? '').trim(); const unit = String(normalized.unit ?? '').trim();
      const quantity = Number(normalized.quantity ?? normalized.qty ?? 0); const rate = Number(normalized.rate ?? 0);
      if (!item_name || !unit || !Number.isFinite(quantity) || !Number.isFinite(rate)) throw new BadRequestException(`Invalid Excel data at row ${index + 2}`);
      let type = String(normalized.cost_type ?? 'material').toLowerCase().replace(/[\s/-]+/g, '_');
      if (type === 'equipment_misc_cost' || type === 'equipment') type = ProcurementBoqCostType.EQUIPMENT_MISC;
      if (type === 'labour_cost') type = ProcurementBoqCostType.LABOUR;
      if (type === 'subcontract_cost') type = ProcurementBoqCostType.SUBCONTRACT;
      return { item_name, item_code: normalized.item_code ? String(normalized.item_code) : undefined, unit, quantity, rate, cost_type: (costTypes.includes(type as any) ? type : ProcurementBoqCostType.MATERIAL) as ProcurementBoqCostType, remarks: normalized.remarks ? String(normalized.remarks) : undefined };
    });
    return this.create({ ...dto, items: itemRows } as CreateProcurementBoqDto, actorId);
  }
}
