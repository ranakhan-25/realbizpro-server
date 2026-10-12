import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvCategory } from '../../../../database/models/inventory/inv_category.model';
import { InvSubCategory } from '../../../../database/models/inventory/inv_sub_category.model';
import { InvCategoryController } from './category.controller';
import { InvCategoryService } from './category.service';

@Module({
  imports: [SequelizeModule.forFeature([InvCategory, InvSubCategory])],
  controllers: [InvCategoryController],
  providers: [InvCategoryService],
  exports: [InvCategoryService],
})
export class InvCategoryModule {}
