import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryDealNegotiationActivityDto {
  @ApiPropertyOptional({ description: 'Search lead, project, flat/land, activity or approval status' }) @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'] }) @IsOptional() @IsIn(['pending', 'approved', 'rejected']) declare status?: string;
  @ApiPropertyOptional({ description: 'Filter by organization ID' }) @IsOptional() @Type(() => Number) @IsInt() declare orgId?: number;
  @ApiPropertyOptional({ default: 1, minimum: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
