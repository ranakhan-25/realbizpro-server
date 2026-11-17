import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAllowanceDeductionSetupDto } from './create-allowance-deduction-setup.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateAllowanceDeductionSetupDto extends PartialType(
  CreateAllowanceDeductionSetupDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
