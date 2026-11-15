/* eslint-disable prettier/prettier */
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectShareAssignmentDto } from './create-project-share-assignment.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectShareAssignmentDto extends PartialType(
  CreateProjectShareAssignmentDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
