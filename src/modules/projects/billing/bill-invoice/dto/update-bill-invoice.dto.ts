/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBillInvoiceDto } from './create-bill-invoice.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateBillInvoiceDto extends PartialType(
  CreateBillInvoiceDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
