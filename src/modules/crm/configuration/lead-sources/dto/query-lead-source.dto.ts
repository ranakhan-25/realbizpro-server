import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { LeadSourceStatus } from './create-lead-source.dto';

export class QueryLeadSourceDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  declare limit?: number;

  @ApiPropertyOptional({ description: 'Search source name or code' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ enum: LeadSourceStatus, description: 'Filter by Active or Inactive status' })
  @IsOptional() @IsEnum(LeadSourceStatus)
  declare status?: LeadSourceStatus;

  @ApiPropertyOptional({ type: Boolean, default: false, description: 'Include soft-deleted lead sources' })
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean()
  declare withDeleted?: boolean;

  @ApiPropertyOptional({ type: Number, description: 'Organization ID' })
  @IsOptional() @Type(() => Number) @IsInt()
  declare orgId?: number;
}
