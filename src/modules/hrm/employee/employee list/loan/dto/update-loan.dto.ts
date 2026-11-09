import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLoanDto } from './create-loan.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateLoanDto extends PartialType(
  CreateLoanDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
