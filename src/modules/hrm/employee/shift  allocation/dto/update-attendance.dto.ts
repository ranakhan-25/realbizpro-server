import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateAttendanceDto extends PartialType(
  CreateAttendanceDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
