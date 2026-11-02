/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreateContraVoucherDto } from './create-contra_voucher.dto';

export class UpdateContraVoucherDto extends PartialType(CreateContraVoucherDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  updatedById?: string;
}