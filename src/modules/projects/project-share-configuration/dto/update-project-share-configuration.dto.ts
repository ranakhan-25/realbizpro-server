import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectShareConfigurationDto } from './create-project-share-configuration.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectShareConfigurationDto extends PartialType(
  CreateProjectShareConfigurationDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
