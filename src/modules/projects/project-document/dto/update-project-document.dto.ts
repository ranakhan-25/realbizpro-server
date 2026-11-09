import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectDocumentDto } from './create-project-document.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectDocumentDto extends PartialType(
  CreateProjectDocumentDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
