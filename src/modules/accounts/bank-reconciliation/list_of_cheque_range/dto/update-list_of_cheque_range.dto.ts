/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateChequeRangeDto } from './create-list_of_cheque_range.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateChequeRangeDto extends PartialType(CreateChequeRangeDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}