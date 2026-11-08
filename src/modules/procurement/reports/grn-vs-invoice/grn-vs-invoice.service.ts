import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementGrnItem } from 'src/database/models/procurement/grn/pr_grn_item.model';
import { ProcurementGrn } from 'src/database/models/procurement/grn/pr_grn.model';
import { ProcurementPurchaseOrder } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';
import { ProcurementPurchaseBill } from 'src/database/models/procurement/purchase-bill/pr_purchase_bill.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { QueryGrnVsInvoiceDto } from './dto/query-grn-vs-invoice.dto';

@Injectable()
export class GrnVsInvoiceService {
  constructor(
    @InjectModel(ProcurementGrnItem) private readonly lines: typeof ProcurementGrnItem,
    @InjectModel(ProcurementGrn) private readonly grns: typeof ProcurementGrn,
    @InjectModel(ProcurementPurchaseBill) private readonly bills: typeof ProcurementPurchaseBill,
    @InjectModel(Category) private readonly categories: typeof Category,
    @InjectModel(ProcurementItemEntry) private readonly items: typeof ProcurementItemEntry,
    @InjectModel(SupplierAccounts) private readonly suppliers: typeof SupplierAccounts,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(ProjectType) private readonly projectTypes: typeof ProjectType,
  ) {}

  async dropdowns() {
    const [bills, grns, categories, items, suppliers, projects, projectTypes] = await Promise.all([
      this.bills.findAll({ attributes: ['uuid', 'code', 'date', 'supplier_id'], order: [['date', 'DESC']] }),
      this.grns.findAll({ attributes: ['uuid', 'code', 'date', 'supplier_id', 'project_id'], order: [['date', 'DESC']] }),
      this.categories.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.items.findAll({ attributes: ['uuid', 'item_code', 'name', 'category_id'], order: [['name', 'ASC']] }),
      this.suppliers.findAll({ attributes: ['uuid', 'supplierCode', 'supplierName'], order: [['supplierName', 'ASC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.projectTypes.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { bills, grns, categories, items, suppliers, projects, projectTypes };
  }

  async report(query: QueryGrnVsInvoiceDto) {
    const grnWhere: any = {};
    if (query.date_from || query.date_to) grnWhere.date = { ...(query.date_from ? { [Op.gte]: query.date_from } : {}), ...(query.date_to ? { [Op.lte]: query.date_to } : {}) };
    if (query.supplier_id) grnWhere.supplier_id = query.supplier_id;
    if (query.project_id) grnWhere.project_id = query.project_id;
    const itemWhere: any = {};
    if (query.category_id) itemWhere.category_id = query.category_id;
    if (query.item_id) itemWhere.uuid = query.item_id;

    const rows = await this.lines.findAll({
      where: {
        ...(query.search ? { [Op.or]: [{ item_name: { [Op.iLike]: `%${query.search}%` } }, { item_code: { [Op.iLike]: `%${query.search}%` } }] } : {}),
      },
      include: [
        { association: 'grn', where: grnWhere, required: true, include: [
          { association: 'purchaseOrder', attributes: ['uuid', 'code'], required: false },
          { association: 'supplier', attributes: ['uuid', 'supplierCode', 'supplierName'], required: false },
          { association: 'project', attributes: ['uuid', 'code', 'name'], required: false },
          { association: 'projectType', attributes: ['uuid', 'code', 'name'], required: false },
          { association: 'purchaseBills', through: { attributes: [] }, attributes: ['uuid', 'code', 'date', 'grand_total'], required: false },
        ] },
        { association: 'item', attributes: ['uuid', 'item_code', 'name', 'category_id'], where: Object.keys(itemWhere).length ? itemWhere : undefined, required: Object.keys(itemWhere).length > 0 },
      ],
      order: [['id', 'ASC']],
    });
    const all = rows.flatMap((line: any) => {
      const grn = line.grn; const bills: any[] = grn?.purchaseBills ?? [];
      const matched = query.bill_id ? bills.filter(bill => bill.uuid === query.bill_id) : bills;
      if (query.bill_id && matched.length === 0) return [];
      const invoiced = matched.length > 0;
      return [{
        id: line.id, date: grn?.date, purchase_order_no: grn?.purchaseOrder?.code ?? '', grn_no: grn?.code,
        bill_no: matched.map(bill => bill.code).join(', '), supplier: grn?.supplier, project: grn?.project, project_type: grn?.projectType,
        item_code: line.item_code, item_name: line.item?.name ?? line.item_name, category_id: line.item?.category_id ?? grn?.category_id,
        grn_qty: Number(line.quantity), already_bill_qty: invoiced ? Number(line.quantity) : 0,
        grn_total: Number(line.amount), bill_total: invoiced ? Number(line.amount) : 0,
      }];
    });
    const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(200, Math.max(1, Number(query.limit) || 10));
    const offset = (page - 1) * limit; const data = all.slice(offset, offset + limit);
    return {
      data, total: all.length, page, limit, totalPages: Math.ceil(all.length / limit),
      totals: all.reduce((sum, row) => ({ grn_qty: sum.grn_qty + row.grn_qty, already_bill_qty: sum.already_bill_qty + row.already_bill_qty, grn_total: sum.grn_total + row.grn_total, bill_total: sum.bill_total + row.bill_total }), { grn_qty: 0, already_bill_qty: 0, grn_total: 0, bill_total: 0 }),
    };
  }
}
