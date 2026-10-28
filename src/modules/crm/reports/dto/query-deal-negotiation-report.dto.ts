import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryDealNegotiationReportDto {
  @ApiPropertyOptional({ description: 'Negotiation created date lower bound (YYYY-MM-DD)' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Negotiation created date upper bound (YYYY-MM-DD)' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Project UUID, project code or project name' })
  @IsOptional() @IsString() declare projectId?: string;

  @ApiPropertyOptional({ description: 'Flat/Land number, for example 12N' })
  @IsOptional() @IsString() declare flatLandNo?: string;

  @ApiPropertyOptional({ description: 'Lead UUID, lead database ID, lead code or lead name' })
  @IsOptional() @IsString() declare leadId?: string;

  @ApiPropertyOptional({ description: 'Negotiation activity type, for example offer or counter_offer' })
  @IsOptional() @IsString() declare activityType?: string;

  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'] })
  @IsOptional() @IsString() declare status?: string;

  @ApiPropertyOptional({ description: 'Creator UUID, user code or user name' })
  @IsOptional() @IsString() declare createdBy?: string;

  @ApiPropertyOptional({ description: 'Search lead, project, flat/land, activity, status or user' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
