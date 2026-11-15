import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateInvoiceItemDto extends PartialType(CreateInvoiceItemDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
