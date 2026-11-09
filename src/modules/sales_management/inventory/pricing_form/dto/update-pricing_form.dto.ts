/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyPricingDto } from './create-pricing_form.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePropertyPricingDto extends PartialType(CreatePropertyPricingDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}