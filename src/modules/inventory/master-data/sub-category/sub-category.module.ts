import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvSubCategory } from '../../../../database/models/inventory/inv_sub_category.model';
import { InvSubCategoryController } from './sub-category.controller';
import { InvSubCategoryService } from './sub-category.service';

@Module({
  imports: [SequelizeModule.forFeature([InvSubCategory])],
  controllers: [InvSubCategoryController],
  providers: [InvSubCategoryService],
  exports: [InvSubCategoryService],
})
export class InvSubCategoryModule {}
