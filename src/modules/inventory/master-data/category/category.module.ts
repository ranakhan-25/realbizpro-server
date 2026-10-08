import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvCategory } from '../../../../database/models/inventory/inv_category.model';
import { InvCategoryController } from './category.controller';
import { InvCategoryService } from './category.service';

@Module({
  imports: [SequelizeModule.forFeature([InvCategory])],
  controllers: [InvCategoryController],
  providers: [InvCategoryService],
  exports: [InvCategoryService],
})
export class InvCategoryModule {}
