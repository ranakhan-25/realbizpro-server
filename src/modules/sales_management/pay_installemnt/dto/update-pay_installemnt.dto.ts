import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-pay_installemnt.dto';

export class UpdatePayInstallemntDto extends PartialType(CreatePaymentDto) {}
