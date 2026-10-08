import { PartialType } from '@nestjs/swagger';
import { CreateInvSupplierDto } from './create-inv-supplier.dto';

export class UpdateInvSupplierDto extends PartialType(CreateInvSupplierDto) {}
