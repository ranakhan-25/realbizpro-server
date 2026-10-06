/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateCustomerAccountDto } from './create_customer_account.dto';

export class UpdateCustomerAccountDto extends PartialType(
  CreateCustomerAccountDto,
) {}
