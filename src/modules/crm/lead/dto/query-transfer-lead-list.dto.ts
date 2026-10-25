import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryTransferLeadListDto {
  @ApiPropertyOptional({ description: 'Transfer date from, inclusive (YYYY-MM-DD)' })
  @IsOptional() @IsString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Transfer date to, inclusive (YYYY-MM-DD)' })
  @IsOptional() @IsString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by transfer source user UUID' })
  @IsOptional() @IsString() declare fromUserId?: string;

  @ApiPropertyOptional({ description: 'Filter by transfer target user UUID' })
  @IsOptional() @IsString() declare toUserId?: string;

  @ApiPropertyOptional({ description: 'Search lead code, name, mobile, or transfer reason' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
