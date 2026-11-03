import { PartialType } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-received-voucher.dto';

export class UpdateReceivedVoucherDto extends PartialType(CreateVoucherDto) {}
