import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { ProcurementBrandController } from './brand.controller';
import { ProcurementBrandService } from './brand.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementBrand])],
  controllers: [ProcurementBrandController],
  providers: [ProcurementBrandService],
  exports: [ProcurementBrandService],
})
export class ProcurementBrandModule {}
