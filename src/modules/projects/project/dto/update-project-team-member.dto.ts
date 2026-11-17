import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectTeamMemberDto } from './create-project-team-member.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectTeamMemberDto extends PartialType(
  CreateProjectTeamMemberDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
