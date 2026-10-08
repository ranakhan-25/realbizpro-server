import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { InvSupplier } from 'src/database/models/inventory/inv_supplier.model';

@Module({
  imports: [SequelizeModule.forFeature([InvSupplier])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
