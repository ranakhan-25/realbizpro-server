import { PartialType } from '@nestjs/swagger';
import { CreateSupplierAccountDto } from './create-supplier_account.dto';


export class UpdateSupplierAccountDto extends PartialType(
  CreateSupplierAccountDto,
) {}