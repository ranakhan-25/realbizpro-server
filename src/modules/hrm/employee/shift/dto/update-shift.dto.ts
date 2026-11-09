import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateShiftDto } from './create-shift.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateShiftDto extends PartialType(
  CreateShiftDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
