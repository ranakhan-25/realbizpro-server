import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum LeadSourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateLeadSourceDto {
  @ApiProperty({ example: 'Facebook', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ description: 'Optional source code used by integrations', maxLength: 100 })
  @IsOptional() @IsString() @MaxLength(100)
  declare code?: string;

  @ApiPropertyOptional({ enum: LeadSourceStatus, default: LeadSourceStatus.ACTIVE })
  @IsOptional() @IsEnum(LeadSourceStatus)
  declare status?: LeadSourceStatus;

  @ApiPropertyOptional({ description: 'UUID or display name of the user adding this source' })
  @IsOptional() @IsString()
  declare createdBy?: string;

  @ApiPropertyOptional({ description: 'Existing project identifier, if applicable' })
  @IsOptional() @IsString()
  declare projectId?: string;
}
