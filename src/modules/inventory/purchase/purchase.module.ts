import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { InvPurchase } from 'src/database/models/inventory/inv_purchase.model';
import { InvPurchaseItem } from 'src/database/models/inventory/inv_purchase_item.model';
import { InvSupplier } from 'src/database/models/inventory/inv_supplier.model';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

@Module({
  imports: [SequelizeModule.forFeature([InvPurchase, InvPurchaseItem, InvSupplier, InvItem])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
