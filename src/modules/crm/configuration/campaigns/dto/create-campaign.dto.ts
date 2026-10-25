import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export enum LeadCampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Jolshiri Lead Campaign', maxLength: 200 })
  @IsString() @IsNotEmpty() @MaxLength(200)
  declare name: string;

  @ApiProperty({ description: 'UUID of the lead source' })
  @IsUUID()
  declare leadSourceUuid: string;

  @ApiPropertyOptional({ description: 'Campaign description' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiPropertyOptional({ description: 'Facebook campaign form identifier' })
  @IsOptional() @IsString() @MaxLength(150)
  declare formId?: string;

  @ApiPropertyOptional({ enum: LeadCampaignStatus, default: LeadCampaignStatus.ACTIVE })
  @IsOptional() @IsEnum(LeadCampaignStatus)
  declare status?: LeadCampaignStatus;

  @ApiPropertyOptional({ format: 'date', example: '2026-10-25' })
  @IsOptional() @IsDateString()
  declare startDate?: string;

  @ApiPropertyOptional({ format: 'date', example: '2026-11-25' })
  @IsOptional() @IsDateString()
  declare endDate?: string;

  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  declare budget?: number;

  @ApiPropertyOptional({ description: 'Campaign channel, if tracked' })
  @IsOptional() @IsString() @MaxLength(100)
  declare channel?: string;

  @ApiPropertyOptional({ description: 'Existing project identifier, if applicable' })
  @IsOptional() @IsString()
  declare projectId?: string;

  @ApiPropertyOptional({ description: 'UUID or display name of the user adding this campaign' })
  @IsOptional() @IsString()
  declare createdBy?: string;
}
