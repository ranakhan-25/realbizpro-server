import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
export class AssignCrmPartyDto {
  @ApiProperty({ description: 'UUID of an active system user' }) @IsUUID() declare assigneeUuid: string;
  @ApiPropertyOptional({ description: 'Assignment note', example: 'Follow up with the party this week' }) @IsOptional() @IsString() declare note?: string;
}
