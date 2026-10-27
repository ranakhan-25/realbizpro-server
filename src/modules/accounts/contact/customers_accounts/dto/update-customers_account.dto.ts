/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateCustomerAccountDto } from './create-customers_account.dto';

export class UpdateCustomerAccountDto extends PartialType(
  OmitType(CreateCustomerAccountDto, ['code', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}