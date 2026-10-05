/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateCustomerAccountDto } from './create-customer-account.dto';

export class UpdateCustomerAccountDto extends PartialType(
  CreateCustomerAccountDto,
) {}
