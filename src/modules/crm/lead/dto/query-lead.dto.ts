import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryLeadDto {
  @ApiPropertyOptional() @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare leadCategoryId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare leadStageId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare leadSourceId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare campaignId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare areaId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare professionId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare assignedTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare creditOfficerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare leadType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare projectName?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) declare teamId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare createdBy?: string;
  @ApiPropertyOptional({ description: 'Filter by organization ID' }) @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare occasion?: 'birthDate' | 'anniversaryDate';
  @ApiPropertyOptional() @IsOptional() @IsString() declare dateFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() declare dateTo?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean() declare withDeleted?: boolean;
}
