import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvStockCount } from '../../../database/models/inventory/stock-count.model';
import { StockCountController } from './stock-count.controller';
import { StockCountService } from './stock-count.service';

@Module({
  imports: [SequelizeModule.forFeature([InvStockCount])],
  controllers: [StockCountController],
  providers: [StockCountService],
  exports: [StockCountService],
})
export class StockCountModule {}
