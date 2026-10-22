import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProcurementPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill.model';
import { ProcurementPurchaseBillGrn } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill_grn.model';
import { ProcurementGrn } from 'src/database/models/procurement/grn/pr_grn.model';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CreatePurchaseBillDto, QueryPurchaseBillDto, UpdatePurchaseBillDto } from './dto/purchase-bill.dto';

const include = [
  { model: SysCompany, as: 'company', attributes: ['uuid', 'name'], required: false },
  { model: SupplierAccounts, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] },
  { model: ProjectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
  { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false },
  { model: SysUser, as: 'addedBy', attributes: ['id', 'name'], required: false },
  { model: ProcurementGrn, as: 'grns', through: { attributes: [] }, attributes: ['uuid', 'code', 'reference', 'date', 'subtotal', 'grand_total', 'supplier_id', 'project_id'] },
];

@Injectable()
export class PurchaseBillService {
  constructor(
    @InjectModel(ProcurementPurchaseBill) private readonly bill: typeof ProcurementPurchaseBill,
    @InjectModel(ProcurementPurchaseBillGrn) private readonly link: typeof ProcurementPurchaseBillGrn,
    @InjectModel(ProcurementGrn) private readonly grn: typeof ProcurementGrn,
    @InjectModel(SysCompany) private readonly company: typeof SysCompany,
    @InjectModel(SysUser) private readonly user: typeof SysUser,
    @InjectModel(SupplierAccounts) private readonly supplier: typeof SupplierAccounts,
    @InjectModel(Project) private readonly project: typeof Project,
    @InjectModel(ProjectType) private readonly projectType: typeof ProjectType,
    private readonly sequelize: Sequelize,
  ) {}

  async list(q: QueryPurchaseBillDto) {
    const page = Math.max(1, Number(q.page) || 1); const limit = Math.min(100, Math.max(1, Number(q.limit) || 10));
    const where: any = {};
    if (q.project_id) where.project_id = q.project_id;
    if (q.supplier_id) where.supplier_id = q.supplier_id;
    if (q.search) where[Op.or] = [{ code: { [Op.iLike]: `%${q.search}%` } }, { note: { [Op.iLike]: `%${q.search}%` } }];
    const result = await this.bill.findAndCountAll({ where, include, distinct: true, limit, offset: (page - 1) * limit, order: [['date', 'DESC'], ['createdAt', 'DESC']] });
    return { data: result.rows, total: result.count, page, limit, totalPages: Math.ceil(result.count / limit), totals: result.rows.reduce((a, b: any) => ({ subtotal: a.subtotal + Number(b.subtotal), grand_total: a.grand_total + Number(b.grand_total), paid: a.paid + Number(b.paid), due: a.due + Number(b.due) }), { subtotal: 0, grand_total: 0, paid: 0, due: 0 }) };
  }

  async dropdowns() {
    const [companies, suppliers, projects, projectTypes] = await Promise.all([
      this.company.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.supplier.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.project.findAll({ attributes: ['uuid', 'code', 'name', 'projectType'], order: [['name', 'ASC']] }),
      this.projectType.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { companies, suppliers, projects, projectTypes };
  }

  async pendingGrns(projectId?: string, supplierId?: string) {
    const where: any = { already_billed: false };
    if (projectId) where.project_id = projectId;
    if (supplierId) where.supplier_id = supplierId;
    return this.grn.findAll({ where, include: [{ model: SupplierAccounts, as: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'] }, { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'], required: false }, { model: ProjectType, as: 'projectType', attributes: ['uuid', 'code', 'name'], required: false }], order: [['date', 'DESC']] });
  }

  async view(uuid: string) { const row = await this.bill.findOne({ where: { uuid }, include }); if (!row) throw new NotFoundException('Purchase bill/invoice not found'); return row; }

  private async compose(dto: CreatePurchaseBillDto, transaction: Transaction, billUuid?: string) {
    if (!dto.grn_ids?.length || new Set(dto.grn_ids).size !== dto.grn_ids.length) throw new BadRequestException('Select one or more unique pending GRNs');
    const selected = await this.grn.findAll({ where: { uuid: { [Op.in]: dto.grn_ids } }, transaction, lock: transaction.LOCK.UPDATE });
    if (selected.length !== dto.grn_ids.length) throw new BadRequestException('One or more selected GRNs do not exist');
    if (selected.some(x => x.already_billed)) throw new BadRequestException('One or more selected GRNs are already billed');
    if (selected.some(x => x.supplier_id !== dto.supplier_id)) throw new BadRequestException('All selected GRNs must belong to the selected supplier');
    const projectIds = [...new Set(selected.map(x => x.project_id).filter(Boolean))];
    if (projectIds.length > 1 || (dto.project_id && projectIds.some(x => x !== dto.project_id))) throw new BadRequestException('Selected GRNs must belong to the selected project');
    const subtotal = selected.reduce((sum, row) => sum + Number(row.grand_total), 0);
    const discount = Number(dto.discount ?? 0); const grandTotal = Math.max(0, subtotal - discount); const paid = Number(dto.paid ?? 0);
    if (paid > grandTotal) throw new BadRequestException('Paid amount cannot exceed the grand total');
    return { selected, values: { date: dto.date, code: dto.code?.trim() || `PURB${Date.now()}`, company_id: dto.company_id, supplier_id: dto.supplier_id, project_id: dto.project_id ?? projectIds[0] ?? null, project_type_id: dto.project_type_id ?? selected[0]?.project_type_id ?? null, subtotal, discount, grand_total: grandTotal, paid, due: grandTotal - paid, note: dto.note, attachment: dto.attachment } };
  }

  async create(dto: CreatePurchaseBillDto, userId?: number) {
    return this.sequelize.transaction(async transaction => {
      const { selected, values } = await this.compose(dto, transaction);
      const bill = await this.bill.create({ ...values, added_by_id: userId } as any, { transaction });
      await this.link.bulkCreate(selected.map(row => ({ purchase_bill_id: bill.uuid, grn_id: row.uuid } as any)), { transaction });
      await this.grn.update({ already_billed: true }, { where: { uuid: { [Op.in]: selected.map(x => x.uuid) } }, transaction });
      return bill.reload({ include, transaction });
    });
  }

  async update(uuid: string, dto: UpdatePurchaseBillDto) {
    return this.sequelize.transaction(async transaction => {
      const bill = await this.bill.findOne({ where: { uuid }, transaction }); if (!bill) throw new NotFoundException('Purchase bill/invoice not found');
      const oldLinks = await this.link.findAll({ where: { purchase_bill_id: uuid }, transaction });
      await this.grn.update({ already_billed: false }, { where: { uuid: { [Op.in]: oldLinks.map(x => x.grn_id) } }, transaction });
      await this.link.destroy({ where: { purchase_bill_id: uuid }, force: true, transaction });
      try {
        const { selected, values } = await this.compose(dto, transaction, uuid);
        await bill.update(values, { transaction });
        await this.link.bulkCreate(selected.map(row => ({ purchase_bill_id: uuid, grn_id: row.uuid } as any)), { transaction });
        await this.grn.update({ already_billed: true }, { where: { uuid: { [Op.in]: selected.map(x => x.uuid) } }, transaction });
      } catch (error) { throw error; }
      return bill.reload({ include, transaction });
    });
  }

  async remove(uuid: string) {
    return this.sequelize.transaction(async transaction => {
      const bill = await this.bill.findOne({ where: { uuid }, transaction }); if (!bill) throw new NotFoundException('Purchase bill/invoice not found');
      const links = await this.link.findAll({ where: { purchase_bill_id: uuid }, transaction });
      await this.grn.update({ already_billed: false }, { where: { uuid: { [Op.in]: links.map(x => x.grn_id) } }, transaction });
      await this.link.destroy({ where: { purchase_bill_id: uuid }, force: true, transaction });
      await bill.destroy({ transaction });
      return { message: 'Purchase bill/invoice deleted successfully' };
    });
  }
}
