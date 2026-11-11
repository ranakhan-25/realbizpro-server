import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSalaryGradeDto } from './create-salary-grade.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateSalaryGradeDto extends PartialType(
  CreateSalaryGradeDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
