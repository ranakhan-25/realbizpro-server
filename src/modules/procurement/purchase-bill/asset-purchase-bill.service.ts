import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProcurementAssetPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_asset_purchase_bill.model';
import { ProcurementAssetPurchaseBillGrn } from 'src/database/models/procurement/purchase-bill/pr_asset_purchase_bill_grn.model';
import { ProcurementAssetGrn } from 'src/database/models/procurement/grn/pr_asset_grn.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CreateAssetPurchaseBillDto, QueryAssetPurchaseBillDto } from './dto/asset-purchase-bill.dto';
@Injectable()
export class AssetPurchaseBillService {
  constructor(
    @InjectModel(ProcurementAssetPurchaseBill) private readonly bill: typeof ProcurementAssetPurchaseBill,
    @InjectModel(ProcurementAssetPurchaseBillGrn) private readonly link: typeof ProcurementAssetPurchaseBillGrn,
    @InjectModel(ProcurementAssetGrn) private readonly grn: typeof ProcurementAssetGrn,
    @InjectModel(SysUser) private readonly user: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplier: typeof SupplierAccounts,
    @InjectModel(Project) private readonly project: typeof Project,
    @InjectModel(ProjectType) private readonly projectType: typeof ProjectType,
    private readonly sequelize: Sequelize,
  ) {}

  private get relationIncludes() {
    return [
      { model: this.supplier, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
      { model: this.projectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
      { model: this.project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false },
      { model: this.user, as: 'addedBy', attributes: ['id', 'name'], required: false },
      { model: this.grn, as: 'grns', through: { attributes: [] }, attributes: ['uuid', 'code', 'reference', 'date', 'subtotal', 'grand_total'] },
    ];
  }

  private get grnRelationIncludes() {
    return [
      { model: this.supplier, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
      { model: this.project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false },
      { model: this.projectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
    ];
  }
  async list(q: QueryAssetPurchaseBillDto) {
    const page = Math.max(1, Number(q.page) || 1); const limit = Math.min(100, Math.max(1, Number(q.limit) || 10)); const where: any = {};
    if (q.project_id) where.project_id = q.project_id; if (q.supplier_id) where.supplier_id = q.supplier_id;
    if (q.search) where[Op.or] = [{ code: { [Op.iLike]: `%${q.search}%` } }, { note: { [Op.iLike]: `%${q.search}%` } }];
    const result = await this.bill.findAndCountAll({ where, include: this.relationIncludes, distinct: true, limit, offset: (page - 1) * limit, order: [['date', 'DESC'], ['createdAt', 'DESC']] });
    return { data: result.rows, total: result.count, page, limit, totalPages: Math.ceil(result.count / limit) };
  }
  async dropdowns() {
    const [suppliers, projects, projectTypes] = await Promise.all([
      this.supplier.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.project.findAll({ attributes: ['uuid', 'code', 'name', 'projectType'], order: [['name', 'ASC']] }),
      this.projectType.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
    ]); return { suppliers, projects, projectTypes };
  }
  async pendingGrns(supplierId?: string, projectId?: string) {
    const where: any = { already_billed: false }; if (supplierId) where.supplier_id = supplierId; if (projectId) where.project_id = projectId;
    return this.grn.findAll({ where, include: this.grnRelationIncludes, order: [['date', 'DESC']] });
  }
  async view(uuid: string) { const row = await this.bill.findOne({ where: { uuid }, include: this.relationIncludes }); if (!row) throw new NotFoundException('Asset purchase bill/invoice not found'); return row; }
  private async validate(dto: CreateAssetPurchaseBillDto, transaction: Transaction) {
    if (!dto.grn_ids?.length || new Set(dto.grn_ids).size !== dto.grn_ids.length) throw new BadRequestException('Select one or more unique pending asset GRNs');
    const rows = await this.grn.findAll({ where: { uuid: { [Op.in]: dto.grn_ids } }, transaction, lock: transaction.LOCK.UPDATE });
    if (rows.length !== dto.grn_ids.length) throw new BadRequestException('One or more selected asset GRNs do not exist');
    if (rows.some(row => row.already_billed)) throw new BadRequestException('One or more selected asset GRNs are already billed');
    if (rows.some(row => row.supplier_id !== dto.supplier_id)) throw new BadRequestException('All selected asset GRNs must belong to selected supplier');
    const projects = [...new Set(rows.map(row => row.project_id).filter(Boolean))];
    if (projects.length > 1 || (dto.project_id && projects.some(id => id !== dto.project_id))) throw new BadRequestException('Selected asset GRNs must belong to selected project');
    const subtotal = rows.reduce((sum, row) => sum + Number(row.grand_total), 0); const discount = Number(dto.discount ?? 0); const grand_total = Math.max(0, subtotal - discount); const paid = Number(dto.paid ?? 0);
    if (paid > grand_total) throw new BadRequestException('Paid amount cannot exceed grand total');
    return { rows, values: { date: dto.date, code: dto.code?.trim() || `APB${Date.now()}`, supplier_id: dto.supplier_id, project_id: dto.project_id ?? projects[0] ?? null, project_type_id: dto.project_type_id ?? rows[0]?.project_type_id ?? null, subtotal, discount, grand_total, paid, due: grand_total - paid, note: dto.note, attachment: dto.attachment } };
  }
  async create(dto: CreateAssetPurchaseBillDto, userId?: number) {
    return this.sequelize.transaction(async transaction => {
      const { rows, values } = await this.validate(dto, transaction); const bill = await this.bill.create({ ...values, added_by_id: userId } as any, { transaction });
      await this.link.bulkCreate(rows.map(row => ({ purchase_bill_id: bill.uuid, grn_id: row.uuid } as any)), { transaction });
      await this.grn.update({ already_billed: true }, { where: { uuid: { [Op.in]: rows.map(row => row.uuid) } }, transaction });
      return bill.reload({ include: this.relationIncludes, transaction });
    });
  }
  async update(uuid: string, dto: CreateAssetPurchaseBillDto) {
    return this.sequelize.transaction(async transaction => {
      const bill = await this.bill.findOne({ where: { uuid }, transaction }); if (!bill) throw new NotFoundException('Asset purchase bill/invoice not found');
      const old = await this.link.findAll({ where: { purchase_bill_id: uuid }, transaction });
      await this.grn.update({ already_billed: false }, { where: { uuid: { [Op.in]: old.map(row => row.grn_id) } }, transaction });
      await this.link.destroy({ where: { purchase_bill_id: uuid }, force: true, transaction });
      const { rows, values } = await this.validate(dto, transaction); await bill.update(values, { transaction });
      await this.link.bulkCreate(rows.map(row => ({ purchase_bill_id: uuid, grn_id: row.uuid } as any)), { transaction });
      await this.grn.update({ already_billed: true }, { where: { uuid: { [Op.in]: rows.map(row => row.uuid) } }, transaction });
      return bill.reload({ include: this.relationIncludes, transaction });
    });
  }
  async remove(uuid: string) {
    return this.sequelize.transaction(async transaction => {
      const bill = await this.bill.findOne({ where: { uuid }, transaction }); if (!bill) throw new NotFoundException('Asset purchase bill/invoice not found');
      const links = await this.link.findAll({ where: { purchase_bill_id: uuid }, transaction });
      await this.grn.update({ already_billed: false }, { where: { uuid: { [Op.in]: links.map(row => row.grn_id) } }, transaction });
      await this.link.destroy({ where: { purchase_bill_id: uuid }, force: true, transaction }); await bill.destroy({ transaction });
      return { message: 'Asset purchase bill/invoice deleted successfully' };
    });
  }
}
