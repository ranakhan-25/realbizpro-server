/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateExpenseDto } from './create-expense_list.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}