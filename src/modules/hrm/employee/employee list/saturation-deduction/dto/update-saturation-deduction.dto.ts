import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSaturationDeductionDto } from './create-saturation-deduction.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateSaturationDeductionDto extends PartialType(
  CreateSaturationDeductionDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
