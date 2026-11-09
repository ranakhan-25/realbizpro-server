/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBonusDto } from './create-bonus.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateBonusDto extends PartialType(
  CreateBonusDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
