import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProcurementGrn, ProcurementGrnApprovalLayer, ProcurementGrnStatus } from 'src/database/models/procurement/grn/pr_grn.model';
import { ProcurementGrnItem } from 'src/database/models/procurement/grn/pr_grn_item.model';
import { ProcurementMaterialIssue, ProcurementMaterialIssueStatus } from 'src/database/models/procurement/material-issue/pr_material_issue.model';
import { ProcurementMaterialIssueItem } from 'src/database/models/procurement/material-issue/pr_material_issue_item.model';
import { CreateMaterialIssueDto, QueryMaterialIssueDto } from './dto/material-issue.dto';

@Injectable()
export class MaterialIssueService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(ProcurementMaterialIssue) private readonly issues: typeof ProcurementMaterialIssue,
    @InjectModel(ProcurementMaterialIssueItem) private readonly issueItems: typeof ProcurementMaterialIssueItem,
    @InjectModel(ProcurementGrn) private readonly grns: typeof ProcurementGrn,
    @InjectModel(ProcurementGrnItem) private readonly grnItems: typeof ProcurementGrnItem,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  private readonly includes = [
    { association: 'grn', attributes: ['uuid', 'code', 'date', 'project_id', 'status'] },
    { association: 'issuedBy', attributes: ['id', 'name', 'firstName', 'lastName'] },
    { association: 'addedBy', attributes: ['id', 'name', 'firstName', 'lastName'] },
    { association: 'items', include: [{ association: 'grnItem', attributes: ['uuid', 'item_code', 'item_name', 'unit'] }] },
  ];

  async dropdowns() {
    const [grns, issuedRows, users] = await Promise.all([
      this.grns.findAll({ where: { status: ProcurementGrnStatus.APPROVED, approval_layer: ProcurementGrnApprovalLayer.ALL_APPROVALS_COMPLETED }, include: [{ association: 'items' }], order: [['date', 'DESC']] }),
      this.issueItems.findAll({ attributes: ['grn_item_id', 'quantity'], include: [{ association: 'issue', attributes: [], where: { status: ProcurementMaterialIssueStatus.ISSUED }, required: true }] }),
      this.users.findAll({ attributes: ['id', 'name', 'firstName', 'lastName'], order: [['name', 'ASC']] }),
    ]);
    const issued = new Map<string, number>();
    for (const row of issuedRows) issued.set(row.grn_item_id, (issued.get(row.grn_item_id) ?? 0) + Number(row.quantity));
    const eligibleGrns = grns.map((grn: any) => ({ ...grn.toJSON(), items: (grn.items ?? []).map((item: any) => ({ ...item.toJSON(), available_qty: Math.max(0, Number(item.quantity) - (issued.get(item.uuid) ?? 0)) })).filter((item: any) => item.available_qty > 0) })).filter((grn: any) => grn.items.length > 0);
    return { grns: eligibleGrns, users, statuses: Object.values(ProcurementMaterialIssueStatus) };
  }

  private async issuedQty(grnItemId: string, transaction: Transaction) {
    const rows = await this.issueItems.findAll({ where: { grn_item_id: grnItemId }, attributes: ['quantity'], include: [{ association: 'issue', attributes: [], where: { status: ProcurementMaterialIssueStatus.ISSUED }, required: true }], transaction });
    return rows.reduce((total, row) => total + Number(row.quantity), 0);
  }

  async create(dto: CreateMaterialIssueDto, actorId?: number) {
    if (new Set(dto.items.map(({ grn_item_id }) => grn_item_id)).size !== dto.items.length) throw new BadRequestException('Duplicate GRN item lines are not allowed');
    return this.sequelize.transaction(async (transaction) => {
      const grn = await this.grns.findOne({ where: { uuid: dto.grn_id, status: ProcurementGrnStatus.APPROVED, approval_layer: ProcurementGrnApprovalLayer.ALL_APPROVALS_COMPLETED } as any, transaction });
      if (!grn) throw new BadRequestException('Only a fully approved GRN can be issued');
      const prepared = [];
      for (const line of dto.items) {
        const grnItem = await this.grnItems.findOne({ where: { uuid: line.grn_item_id, grn_id: grn.uuid } as any, transaction, lock: transaction.LOCK.UPDATE });
        if (!grnItem) throw new BadRequestException('A selected item does not belong to the selected GRN');
        const alreadyIssued = await this.issuedQty(grnItem.uuid, transaction);
        const availableQty = Number(grnItem.quantity) - alreadyIssued;
        if (line.quantity > availableQty) throw new BadRequestException(`${grnItem.item_name}: requested quantity exceeds available stock (${Math.max(availableQty, 0)})`);
        const amount = Number((line.quantity * Number(grnItem.rate)).toFixed(2));
        prepared.push({ grn_item_id: grnItem.uuid, item_code: grnItem.item_code, item_name: grnItem.item_name, details: grnItem.details, unit: grnItem.unit, quantity: line.quantity, rate: grnItem.rate, amount });
      }
      const issue = await this.issues.create({ issue_no: `MI-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`, grn_id: grn.uuid, date: dto.date, purpose: dto.purpose.trim(), issued_by_id: dto.issued_by_id ?? actorId, added_by_id: actorId, total_amount: Number(prepared.reduce((sum, item) => sum + item.amount, 0).toFixed(2)), status: ProcurementMaterialIssueStatus.ISSUED, notes: dto.notes }, { transaction });
      await this.issueItems.bulkCreate(prepared.map((item) => ({ ...item, material_issue_id: issue.uuid })), { transaction });
      return this.findOne(issue.uuid, transaction);
    });
  }

  async findAll(query: QueryMaterialIssueDto, onlyDeleted = false) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.date_from || query.date_to) where.date = { ...(query.date_from ? { [Op.gte]: query.date_from } : {}), ...(query.date_to ? { [Op.lte]: query.date_to } : {}) };
    if (query.grn_no) where['$grn.code$'] = { [Op.iLike]: `%${query.grn_no}%` };
    if (onlyDeleted) where.deleted_at = { [Op.ne]: null };
    const sort = query.sort_by_date?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const { rows, count } = await this.issues.findAndCountAll({ where, include: this.includes, paranoid: !onlyDeleted, distinct: true, limit, offset: (page - 1) * limit, order: [['date', sort], ['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const issue = await this.issues.findOne({ where: { uuid } as any, include: this.includes, transaction });
    if (!issue) throw new NotFoundException(`Material issue ${uuid} was not found`);
    return issue;
  }

  async cancel(uuid: string) {
    const issue = await this.issues.findOne({ where: { uuid } as any });
    if (!issue) throw new NotFoundException('Material issue not found');
    await issue.update({ status: ProcurementMaterialIssueStatus.CANCELLED });
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    return this.sequelize.transaction(async (transaction) => {
      const issue = await this.issues.findOne({ where: { uuid } as any, transaction });
      if (!issue) throw new NotFoundException('Material issue not found');
      await issue.update({ status: ProcurementMaterialIssueStatus.CANCELLED }, { transaction });
      await issue.destroy({ transaction });
      return { message: 'Material issue moved to trash; issued quantity is released' };
    });
  }
}
