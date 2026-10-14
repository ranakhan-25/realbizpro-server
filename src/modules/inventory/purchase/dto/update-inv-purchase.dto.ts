import { PartialType } from '@nestjs/swagger';
import { CreateInvPurchaseDto } from './create-inv-purchase.dto';

export class UpdateInvPurchaseDto extends PartialType(CreateInvPurchaseDto) {}
