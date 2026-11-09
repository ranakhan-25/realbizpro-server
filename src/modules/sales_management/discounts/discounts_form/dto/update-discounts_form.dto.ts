/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-discounts_form.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}