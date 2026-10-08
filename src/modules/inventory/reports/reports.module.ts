import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { InvItem } from 'src/database/models/inventory/inv_item.model';

@Module({
  imports: [SequelizeModule.forFeature([InvItem])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
