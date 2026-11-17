import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOvertimeDto } from './create-overtime.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateOvertimeDto extends PartialType(
  CreateOvertimeDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
