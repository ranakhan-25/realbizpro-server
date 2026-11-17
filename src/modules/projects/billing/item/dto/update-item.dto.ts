/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateItemDto extends PartialType(
  CreateItemDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
