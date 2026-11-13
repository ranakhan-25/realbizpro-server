/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreatePayCommissionDto } from './create-paymodal.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePayCommissionDto extends PartialType(CreatePayCommissionDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}