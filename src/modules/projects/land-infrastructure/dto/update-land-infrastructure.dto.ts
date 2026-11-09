import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLandInfrastructureDto } from './create-land-infrastructure.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateLandInfrastructureDto extends PartialType(
  CreateLandInfrastructureDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
