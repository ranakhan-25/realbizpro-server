/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/swagger';

import { CreateSupplierAccountDto } from './create_supplier_account.dto';

export class UpdateSupplierAccountDto extends PartialType(
  CreateSupplierAccountDto,
) {}
