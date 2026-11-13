import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvMovement } from '../../../database/models/inventory/inv-movement.model';
import { InvStockBalance } from '../../../database/models/inventory/stock-balance.model';
import { InvItem } from '../../../database/models/inventory/inv_item.model';
import { InvWarehouse } from '../../../database/models/inventory/warehouse.model';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InvMovement,
      InvStockBalance,
      InvItem,
      InvWarehouse,
    ]),
  ],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [MovementService],
})
export class MovementModule {}
