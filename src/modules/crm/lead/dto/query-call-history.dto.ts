import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryCallHistoryDto {
  @ApiPropertyOptional({ description: 'Assignment date from, inclusive (YYYY-MM-DD)' })
  @IsOptional() @IsString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Assignment date to, inclusive (YYYY-MM-DD)' })
  @IsOptional() @IsString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned-from user UUID' })
  @IsOptional() @IsString() declare fromUserId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned-to user UUID' })
  @IsOptional() @IsString() declare toUserId?: string;

  @ApiPropertyOptional({ description: 'Search lead ID/code, name, phone, and assignment note' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
