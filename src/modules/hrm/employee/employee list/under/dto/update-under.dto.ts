import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUnderDto } from './create-under.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateUnderDto extends PartialType(
  CreateUnderDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
