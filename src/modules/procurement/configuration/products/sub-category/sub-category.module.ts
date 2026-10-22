import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementSubCategory } from 'src/database/models/procurement/configuration/products/pr_sub_category.model';
import { ProcurementSubCategoryController } from './sub-category.controller';
import { ProcurementSubCategoryService } from './sub-category.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProcurementSubCategory,
      Category,
    ]),
  ],
  controllers: [ProcurementSubCategoryController],
  providers: [ProcurementSubCategoryService],
  exports: [ProcurementSubCategoryService],
})
export class ProcurementSubCategoryModule {}
