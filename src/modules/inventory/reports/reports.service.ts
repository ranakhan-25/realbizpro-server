import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(InvItem) private readonly itemModel: typeof InvItem,
    private sequelize: Sequelize,
  ) {}

  async getStockReport(projectId?: number, itemId?: string) {
    // Basic scaffold for stock report
    // Real implementation would aggregate SUM(purchase) + SUM(transfer_in) - SUM(usage) - SUM(transfer_out)
    return {
      status: true,
      data: [
        {
          item_id: 'sample-uuid',
          item_code: 'ITM-001',
          item_name: 'Sample Cement',
          total_purchased: 500,
          total_issued: 200,
          current_stock: 300,
        }
      ]
    };
  }

  async getMaterialComparison(projectId: number) {
    return {
      status: true,
      data: [
        {
          item_name: 'Sample Rod',
          budget_qty: 1000,
          purchase_qty: 800,
          issue_qty: 700,
          available_qty: 100
        }
      ]
    };
  }

  async getItemHistory(itemId?: string) {
    return {
      status: true,
      data: [
        {
          id: 1,
          date: '2026-09-01',
          invoiceNo: 'PUR-2026-001',
          project: 'Sheba Eyecon Tower',
          task: 'Beam Concreting Level-4',
          in: 25,
          out: 0,
          balance: 25,
          unitCost: 94500,
          subTotal: 2362500,
          category: 'Deformed Rebar & Steels',
          itemName: 'BSRM 16mm TMT 500W High Strength Bar',
          site: 'Tower 1 Foundation Site',
        },
        {
          id: 2,
          date: '2026-09-12',
          invoiceNo: 'MU-2026-001',
          project: 'Sheba Eyecon Tower',
          task: 'Pillar Casting Work',
          in: 0,
          out: 10,
          balance: 15,
          unitCost: 94500,
          subTotal: 945000,
          category: 'Deformed Rebar & Steels',
          itemName: 'BSRM 16mm TMT 500W High Strength Bar',
          site: 'Tower 1 Foundation Site',
        }
      ]
    };
  }
}
