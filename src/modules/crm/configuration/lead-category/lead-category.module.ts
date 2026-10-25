import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadCategory } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadCategoryController } from './lead-category.controller';
import { LeadCategoryService } from './lead-category.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadCategory, Lead])],
  controllers: [LeadCategoryController],
  providers: [LeadCategoryService],
  exports: [LeadCategoryService],
})
export class LeadCategoryModule {}
