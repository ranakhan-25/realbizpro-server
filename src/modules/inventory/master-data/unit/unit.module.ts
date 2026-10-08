import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvUnit } from '../../../../database/models/inventory/inv_unit.model';
import { InvUnitController } from './unit.controller';
import { InvUnitService } from './unit.service';

@Module({
  imports: [SequelizeModule.forFeature([InvUnit])],
  controllers: [InvUnitController],
  providers: [InvUnitService],
  exports: [InvUnitService],
})
export class InvUnitModule {}
