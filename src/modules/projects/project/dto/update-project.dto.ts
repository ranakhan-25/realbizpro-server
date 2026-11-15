import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
