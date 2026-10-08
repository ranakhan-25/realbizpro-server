import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferController } from './stock-transfer.controller';
import { InvStockTransfer } from 'src/database/models/inventory/inv_stock_transfer.model';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

@Module({
  imports: [SequelizeModule.forFeature([InvStockTransfer, InvItem])],
  controllers: [StockTransferController],
  providers: [StockTransferService],
})
export class StockTransferModule {}
