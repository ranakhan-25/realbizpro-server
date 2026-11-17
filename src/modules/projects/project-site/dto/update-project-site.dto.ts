/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectSiteDto } from './create-project-site.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectSiteDto extends PartialType(
  CreateProjectSiteDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
