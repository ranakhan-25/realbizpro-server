import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProcurementDashboardPeriod, ProcurementDashboardQueryDto } from './dto/procurement-dashboard.dto';

type DateRange = { start: string; end: string } | null;

@Injectable()
export class ProcurementDashboardService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async getDashboard(query: ProcurementDashboardQueryDto) {
    const range = this.getRange(query);
    const previous = this.previousRange(range);
    const [pendingRequisition, requisition, pendingPurchaseOrder, purchaseOrder, pendingGrn, pendingPurchaseBill] = await Promise.all([
      this.metric('pr_material_requisition', 'date', range, previous, "status = 'pending'"),
      this.metric('pr_material_requisition', 'date', range, previous),
      this.metric('pr_purchase_order', 'date', range, previous, "status = 'pending'"),
      this.metric('pr_purchase_order', 'date', range, previous),
      this.metric('pr_grn', 'date', range, previous, "status = 'pending'"),
      this.metric('pr_purchase_bill', 'date', range, previous, "approval_layer = 'pending'"),
    ]);
    const [overflowMaterial, pendingVouchers] = await Promise.all([
      this.getOverflowMaterials(range),
      this.getPendingVouchers(range, query.search, Math.min(50, Math.max(1, Number(query.limit) || 8))),
    ]);
    return {
      period: query.period ?? (query.startDate || query.endDate ? 'custom' : ProcurementDashboardPeriod.MONTHLY),
      dateRange: range,
      metrics: { pendingRequisition, requisition, pendingPurchaseOrder, purchaseOrder, pendingGrn, pendingPurchaseBill },
      overflowMaterial,
      pendingVouchers,
    };
  }

  private async metric(table: string, dateColumn: string, range: DateRange, previous: DateRange, extraWhere = '') {
    const count = async (window: DateRange) => {
      const where = ["deleted_at IS NULL", extraWhere, ...(window ? [`${dateColumn} BETWEEN :startDate AND :endDate`] : [])].filter(Boolean).join(' AND ');
      const rows = await this.sequelize.query<{ count: string }>(`SELECT COUNT(*)::int AS count FROM ${table} WHERE ${where}`, {
        type: QueryTypes.SELECT,
        replacements: window ? { startDate: window.start, endDate: window.end } : {},
      });
      return Number(rows[0]?.count ?? 0);
    };
    const [currentCount, previousCount] = await Promise.all([count(range), previous ? count(previous) : Promise.resolve(0)]);
    return { count: currentCount, previousCount, changePercent: previousCount ? Number((((currentCount - previousCount) / previousCount) * 100).toFixed(1)) : null };
  }

  private getRange(query: ProcurementDashboardQueryDto): DateRange {
    if (query.startDate || query.endDate) {
      return { start: query.startDate ?? '1970-01-01', end: query.endDate ?? this.dhakaToday() };
    }
    const today = this.dhakaToday();
    const end = new Date(`${today}T00:00:00.000Z`);
    const start = new Date(end);
    switch (query.period ?? ProcurementDashboardPeriod.MONTHLY) {
      case ProcurementDashboardPeriod.TODAY: break;
      case ProcurementDashboardPeriod.WEEKLY: start.setUTCDate(start.getUTCDate() - 6); break;
      case ProcurementDashboardPeriod.MONTHLY: start.setUTCDate(start.getUTCDate() - 29); break;
      case ProcurementDashboardPeriod.YEARLY: start.setUTCFullYear(start.getUTCFullYear() - 1); break;
      case ProcurementDashboardPeriod.ALL: return null;
    }
    return { start: start.toISOString().slice(0, 10), end: today };
  }

  private previousRange(range: DateRange): DateRange {
    if (!range) return null;
    const start = new Date(`${range.start}T00:00:00.000Z`);
    const end = new Date(`${range.end}T00:00:00.000Z`);
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    const previousEnd = new Date(start);
    previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
    const previousStart = new Date(previousEnd);
    previousStart.setUTCDate(previousStart.getUTCDate() - days + 1);
    return { start: previousStart.toISOString().slice(0, 10), end: previousEnd.toISOString().slice(0, 10) };
  }

  private async getOverflowMaterials(range: DateRange) {
    const replacements = range ? { startDate: range.start, endDate: range.end } : {};
    const requestDateFilter = range ? 'AND req.date BETWEEN :startDate AND :endDate' : '';
    const issueDateFilter = range ? 'AND grn.date BETWEEN :startDate AND :endDate' : '';
    const rows = await this.sequelize.query<any>(`
      SELECT req.uuid AS requisition_uuid, req.code AS requisition_code, req.status AS requisition_status,
             ri.item_code, COALESCE(ri.item_name, ri.details, ri.item_code) AS description, ri.unit,
             ri.budget_qty, ri.rate,
             COALESCE(issued.issue_qty, 0) AS issue_qty,
             COALESCE(issued.issue_amount, 0) AS issue_amount
      FROM pr_material_requisition_items ri
      INNER JOIN pr_material_requisition req ON req.uuid = ri.requisition_id AND req.deleted_at IS NULL
      LEFT JOIN (
        SELECT grn.requisition_id, issue_item.item_code,
               SUM(issue_item.quantity) AS issue_qty, SUM(issue_item.amount) AS issue_amount
        FROM pr_material_issue_items issue_item
        INNER JOIN pr_material_issues issue ON issue.uuid = issue_item.material_issue_id AND issue.deleted_at IS NULL
        INNER JOIN pr_grn grn ON grn.uuid = issue.grn_id AND grn.deleted_at IS NULL
        WHERE issue_item.deleted_at IS NULL ${issueDateFilter}
        GROUP BY grn.requisition_id, issue_item.item_code
      ) issued ON issued.requisition_id = req.uuid AND issued.item_code = ri.item_code
      WHERE ri.deleted_at IS NULL ${requestDateFilter}
      ORDER BY req.date DESC, ri.created_at ASC`,
      { type: QueryTypes.SELECT, replacements },
    );
    return rows.map((row) => {
      const budgetQty = Number(row.budget_qty) || 0;
      const issueQty = Number(row.issue_qty) || 0;
      return {
        requisition: { uuid: row.requisition_uuid, code: row.requisition_code },
        itemCode: row.item_code,
        description: row.description,
        unit: row.unit,
        budgetQty,
        budgetAmount: budgetQty * (Number(row.rate) || 0),
        issueQty,
        issueAmount: Number(row.issue_amount) || 0,
        status: row.requisition_status === 'completed' ? 'completed' : issueQty >= budgetQty && budgetQty > 0 ? 'issued' : 'pending',
      };
    });
  }

  private async getPendingVouchers(range: DateRange, search?: string, limit = 8) {
    const clauses = ['bill.deleted_at IS NULL', "bill.approval_layer = 'pending'", '(:search IS NULL OR bill.code ILIKE :searchPattern OR project.name ILIKE :searchPattern OR project.code ILIKE :searchPattern OR supplier."supplierName" ILIKE :searchPattern)'];
    const replacements: Record<string, unknown> = { search: search || null, searchPattern: `%${search ?? ''}%`, limit };
    if (range) {
      clauses.push('bill.date BETWEEN :startDate AND :endDate');
      replacements.startDate = range.start;
      replacements.endDate = range.end;
    }
    const rows = await this.sequelize.query<any>(`
      SELECT bill.uuid, bill.code AS reference, bill.date, bill.grand_total AS amount,
             bill.approval_layer,
             project.uuid AS project_uuid, project.code AS project_code, project.name AS project_name,
             project."contactPersonName" AS contact_person, project."contactPhone" AS contact_phone,
             supplier.uuid AS supplier_uuid, supplier."supplierName" AS supplier_name, supplier.phone AS supplier_phone,
             creator.id AS creator_id, creator.name AS creator_name,
             COUNT(*) OVER()::int AS total_count
      FROM pr_purchase_bill bill
      LEFT JOIN project ON project.uuid = bill.project_id AND project.deleted_at IS NULL
      LEFT JOIN supplier_accounts supplier ON supplier.uuid = bill.supplier_id AND supplier.deleted_at IS NULL
      LEFT JOIN sys_users creator ON creator.id = bill.added_by_id
      WHERE ${clauses.join(' AND ')}
      ORDER BY bill.date DESC, bill.created_at DESC
      LIMIT :limit`,
      { type: QueryTypes.SELECT, replacements },
    );
    return {
      count: Number(rows[0]?.total_count ?? 0),
      data: rows.map((row) => ({
        uuid: row.uuid, reference: row.reference, date: row.date, amount: Number(row.amount) || 0,
        project: row.project_uuid ? { uuid: row.project_uuid, code: row.project_code, name: row.project_name, contactPerson: row.contact_person, contactPhone: row.contact_phone } : null,
        supplier: row.supplier_uuid ? { uuid: row.supplier_uuid, name: row.supplier_name, phone: row.supplier_phone } : null,
        addedBy: row.creator_id ? { id: row.creator_id, name: row.creator_name } : null,
        approvalLayer: row.approval_layer,
      })),
    };
  }

  private dhakaToday() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
  }
}
