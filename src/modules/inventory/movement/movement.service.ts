import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { InvMovement } from '../../../database/models/inventory/inv-movement.model';
import { InvStockBalance } from '../../../database/models/inventory/stock-balance.model';
import { InvItem } from '../../../database/models/inventory/inv_item.model';
import { InvWarehouse } from '../../../database/models/inventory/warehouse.model';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class MovementService {
  constructor(
    @InjectModel(InvMovement)
    private readonly movementModel: typeof InvMovement,
    @InjectModel(InvStockBalance)
    private readonly balanceModel: typeof InvStockBalance,
    @InjectModel(InvItem)
    private readonly itemModel: typeof InvItem,
    @InjectModel(InvWarehouse)
    private readonly warehouseModel: typeof InvWarehouse,
    private readonly sequelize: Sequelize,
  ) {}

  async recordMovement(
    type: 'opening' | 'issue' | 'return' | 'transfer' | 'adjustment' | 'consumption',
    dto: CreateMovementDto,
    user?: any,
  ): Promise<InvMovement> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || dto.org_id;
    if (!orgId) {
      throw new BadRequestException('Organization identifier (org_id) is mandatory');
    }

    const qty = Number(dto.quantity);
    if (!qty || qty <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const transaction = await this.sequelize.transaction();
    try {
      const count = await this.movementModel.count({ where: { org_id: orgId }, transaction });
      const movementNo = `MOV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
      const totalAmount = dto.total_amount || (Number(dto.unit_rate || 0) * qty);

      const movement = await this.movementModel.create(
        {
          ...dto,
          org_id: orgId,
          movement_no: movementNo,
          movement_type: type,
          movement_date: dto.movement_date || new Date(),
          total_amount: totalAmount,
          createdBy: user?.id?.toString() || user?.name,
        } as any,
        { transaction },
      );

      // Determine delta multiplier for source warehouse
      let sourceDelta = 0;
      if (type === 'opening' || type === 'return') {
        sourceDelta = qty; // Inflow
      } else if (type === 'issue' || type === 'consumption' || type === 'transfer') {
        sourceDelta = -qty; // Outflow
      } else if (type === 'adjustment') {
        // By default adjustments can be positive or negative
        sourceDelta = qty;
      }

      await this.updateOrCreateBalance(orgId, dto.warehouse_id, dto.item_id, sourceDelta, dto.unit_rate, transaction);

      // If transfer, credit destination warehouse
      if (type === 'transfer' && dto.to_warehouse_id) {
        await this.updateOrCreateBalance(orgId, dto.to_warehouse_id, dto.item_id, qty, dto.unit_rate, transaction);
      }

      await transaction.commit();
      return movement;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async updateOrCreateBalance(
    orgId: string,
    warehouseId: number,
    itemId: string,
    deltaQty: number,
    rate: number = 0,
    transaction: any,
  ) {
    let balance = await this.balanceModel.findOne({
      where: { org_id: orgId, warehouse_id: warehouseId, item_id: itemId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!balance) {
      balance = await this.balanceModel.create(
        {
          org_id: orgId,
          warehouse_id: warehouseId,
          item_id: itemId,
          current_qty: Math.max(0, deltaQty),
          available_qty: Math.max(0, deltaQty),
          reserved_qty: 0,
          avg_cost: rate || 0,
          last_movement_at: new Date(),
        } as any,
        { transaction },
      );
    } else {
      const curr = Number(balance.current_qty ?? (balance as any).getDataValue?.('current_qty') ?? 0);
      const avail = Number(balance.available_qty ?? (balance as any).getDataValue?.('available_qty') ?? 0);
      const validCurr = isNaN(curr) ? 0 : curr;
      const validAvail = isNaN(avail) ? 0 : avail;
      const newQty = validCurr + deltaQty;
      const newAvailable = validAvail + deltaQty;
      await balance.update(
        {
          current_qty: newQty,
          available_qty: newAvailable,
          avg_cost: rate ? rate : (balance.avg_cost || (balance as any).getDataValue?.('avg_cost') || 0),
          last_movement_at: new Date(),
        },
        { transaction },
      );
    }
  }

  async getStockBalances(filter?: {
    org_id?: string;
    warehouse_id?: number;
    item_id?: string;
  }): Promise<InvStockBalance[]> {
    const where: any = {};
    if (filter?.org_id) where.org_id = filter.org_id;
    if (filter?.warehouse_id) where.warehouse_id = filter.warehouse_id;
    if (filter?.item_id) where.item_id = filter.item_id;

    return await this.balanceModel.findAll({
      where,
      include: [
        { model: this.warehouseModel, as: 'warehouse', required: false },
        { model: this.itemModel, as: 'item', required: false },
      ],
      order: [['current_qty', 'DESC']],
    });
  }

  async getLedger(filter?: {
    org_id?: string;
    warehouse_id?: number;
    item_id?: string;
    movement_type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<InvMovement[]> {
    const where: any = {};
    if (filter?.org_id) where.org_id = filter.org_id;
    if (filter?.warehouse_id) where.warehouse_id = filter.warehouse_id;
    if (filter?.item_id) where.item_id = filter.item_id;
    if (filter?.movement_type && filter.movement_type !== 'ALL') {
      where.movement_type = filter.movement_type;
    }
    if (filter?.from_date && filter?.to_date) {
      where.movement_date = { [Op.between]: [filter.from_date, filter.to_date] };
    }

    return await this.movementModel.findAll({
      where,
      include: [
        { model: this.warehouseModel, as: 'warehouse', required: false },
        { model: this.itemModel, as: 'item', required: false },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async getSlowMoving(orgId: string): Promise<any[]> {
    const balances = await this.getStockBalances({ org_id: orgId });
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return balances.filter((b) => {
      if (!b.last_movement_at) return true;
      return new Date(b.last_movement_at) < ninetyDaysAgo;
    });
  }
}
