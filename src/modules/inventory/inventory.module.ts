import { Module } from '@nestjs/common';
import { InvCategoryModule } from './master-data/category/category.module';
import { InvSubCategoryModule } from './master-data/sub-category/sub-category.module';
import { InvBrandModule } from './master-data/brand/brand.module';
import { InvUnitModule } from './master-data/unit/unit.module';
import { InvItemModule } from './master-data/item/item.module';

@Module({
  imports: [
    InvCategoryModule,
    InvSubCategoryModule,
    InvBrandModule,
    InvUnitModule,
    InvItemModule,
  ],
})
export class InventoryModule {}
