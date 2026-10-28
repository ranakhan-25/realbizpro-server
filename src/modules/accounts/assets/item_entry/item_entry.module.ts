import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemEntry } from 'src/database/models/accounts/assets/acc_item_entry_model';
import { ItemEntryService } from './item_entry.service';
import { ItemEntryController } from './item_entry.controller';

@Module({
  imports: [SequelizeModule.forFeature([ItemEntry])],
  controllers: [ItemEntryController],
  providers: [ItemEntryService],
})
export class ItemEntryModule {}
