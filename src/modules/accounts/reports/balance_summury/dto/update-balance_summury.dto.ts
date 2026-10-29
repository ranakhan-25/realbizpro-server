/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBalanceSheetDto } from './create-balance_summury.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBalanceSheetDto extends PartialType(CreateBalanceSheetDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}