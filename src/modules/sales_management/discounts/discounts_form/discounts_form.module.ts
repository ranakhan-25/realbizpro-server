/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DiscountService } from './discounts_form.service';
import { DiscountController } from './discounts_form.controller'; // ✅ ইমপোর্ট
import { Discount } from 'src/database/models/sales_management/sm_discount.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Discount]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {} // ✅ ক্লাসের নাম