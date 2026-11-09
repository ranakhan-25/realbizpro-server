/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HoldProperty } from '../../../../database/models/sales_management/sm_hold-property.model';
import { HoldPropertyService } from './hold_modal.service';
import { HoldPropertyController } from './hold_modal.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([HoldProperty]),
  ],
  controllers: [HoldPropertyController],
  providers: [HoldPropertyService],
  exports: [HoldPropertyService],
})
export class HoldModalModule {}