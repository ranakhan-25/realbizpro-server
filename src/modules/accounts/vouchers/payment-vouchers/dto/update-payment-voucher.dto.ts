import { IsOptional, IsString } from 'class-validator';
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePaymentVoucherDto } from './create-payment-voucher.dto';

export class UpdatePaymentVoucherDto extends PartialType(CreatePaymentVoucherDto) {  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

}
