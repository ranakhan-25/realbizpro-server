import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvItem } from '../../../../database/models/inventory/inv_item.model';
import { InvItemController } from './item.controller';
import { InvItemService } from './item.service';

@Module({
  imports: [SequelizeModule.forFeature([InvItem])],
  controllers: [InvItemController],
  providers: [InvItemService],
  exports: [InvItemService],
})
export class InvItemModule {}
