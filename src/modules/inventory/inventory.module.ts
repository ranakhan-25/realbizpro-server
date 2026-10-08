import { Module } from '@nestjs/common';
import { InvCategoryModule } from './master-data/category/category.module';
import { InvSubCategoryModule } from './master-data/sub-category/sub-category.module';
import { InvBrandModule } from './master-data/brand/brand.module';
import { InvUnitModule } from './master-data/unit/unit.module';
import { InvItemModule } from './master-data/item/item.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseModule } from './purchase/purchase.module';
import { MaterialUsageModule } from './material-usage/material-usage.module';
import { StockTransferModule } from './stock-transfer/stock-transfer.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    InvCategoryModule,
    InvSubCategoryModule,
    InvBrandModule,
    InvUnitModule,
    InvItemModule,
    SupplierModule,
    PurchaseModule,
    MaterialUsageModule,
    StockTransferModule,
    ReportsModule,
  ],
})
export class InventoryModule {}
