import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Sales Team', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'UUID of the team leader' })
  @IsUUID()
  leaderUuid: string;

  @ApiProperty({ description: 'UUIDs of team members', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  memberUuids: string[];

  @ApiPropertyOptional({ description: 'UUID of the user adding the team' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
