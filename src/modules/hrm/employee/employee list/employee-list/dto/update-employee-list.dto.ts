import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmployeeListDto } from './create-employee-list.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateEmployeeListDto extends PartialType(
  CreateEmployeeListDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
