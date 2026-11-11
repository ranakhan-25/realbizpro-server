import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectTypeDto } from './create-project-type.dto';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectTypeDto extends PartialType(CreateProjectTypeDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}