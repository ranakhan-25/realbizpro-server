import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationDto } from './create-quotation.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}