import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvItem } from '../../../../database/models/inventory/inv_item.model';
import { InvCategory } from '../../../../database/models/inventory/inv_category.model';
import { InvSubCategory } from '../../../../database/models/inventory/inv_sub_category.model';
import { InvBrand } from '../../../../database/models/inventory/inv_brand.model';
import { InvUnit } from '../../../../database/models/inventory/inv_unit.model';
import { InvItemController } from './item.controller';
import { InvItemService } from './item.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InvItem,
      InvCategory,
      InvSubCategory,
      InvBrand,
      InvUnit,
    ]),
  ],
  controllers: [InvItemController],
  providers: [InvItemService],
  exports: [InvItemService],
})
export class InvItemModule {}
