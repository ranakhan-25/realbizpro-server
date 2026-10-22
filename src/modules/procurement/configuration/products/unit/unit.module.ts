import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementUnitController } from './unit.controller';
import { ProcurementUnitService } from './unit.service';

@Module({
  imports: [SequelizeModule.forFeature([ProcurementUnit])],
  controllers: [ProcurementUnitController],
  providers: [ProcurementUnitService],
  exports: [ProcurementUnitService],
})
export class ProcurementUnitModule {}
