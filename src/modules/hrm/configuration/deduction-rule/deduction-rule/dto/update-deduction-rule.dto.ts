/* eslint-disable prettier/prettier */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDeductionRuleDto } from './create-deduction-rule.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateDeductionRuleDto extends PartialType(
  CreateDeductionRuleDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
