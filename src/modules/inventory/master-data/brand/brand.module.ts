import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvBrand } from '../../../../database/models/inventory/inv_brand.model';
import { InvBrandController } from './brand.controller';
import { InvBrandService } from './brand.service';

@Module({
  imports: [SequelizeModule.forFeature([InvBrand])],
  controllers: [InvBrandController],
  providers: [InvBrandService],
  exports: [InvBrandService],
})
export class InvBrandModule {}
