import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvStockIssue } from '../../../database/models/inventory/stock-issue.model';
import { StockIssueController } from './stock-issue.controller';
import { StockIssueService } from './stock-issue.service';

@Module({
  imports: [SequelizeModule.forFeature([InvStockIssue])],
  controllers: [StockIssueController],
  providers: [StockIssueService],
  exports: [StockIssueService],
})
export class StockIssueModule {}
