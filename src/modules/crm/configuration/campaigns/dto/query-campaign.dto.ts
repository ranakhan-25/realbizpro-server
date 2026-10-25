import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { LeadCampaignStatus } from './create-campaign.dto';

export class QueryCampaignDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  declare limit?: number;

  @ApiPropertyOptional({ description: 'Search campaign name, description, or form ID' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ description: 'Filter by lead source UUID' })
  @IsOptional() @IsUUID()
  declare leadSourceUuid?: string;

  @ApiPropertyOptional({ enum: LeadCampaignStatus })
  @IsOptional() @IsEnum(LeadCampaignStatus)
  declare status?: LeadCampaignStatus;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  declare withDeleted?: boolean;
}
