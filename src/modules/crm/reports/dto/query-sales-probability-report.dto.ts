import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class QuerySalesProbabilityReportDto {
  @ApiPropertyOptional({ description: 'Filter by assigned user UUID or user code' })
  @IsOptional() @IsString()
  declare userId?: string;

  @ApiPropertyOptional({ type: Number, example: 0, minimum: 0, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100)
  declare minimumPercentage?: number;

  @ApiPropertyOptional({ type: Number, example: 100, minimum: 0, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100)
  declare maximumPercentage?: number;

  @ApiPropertyOptional({ description: 'Search by lead name, lead code, stage, user, or probability' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare limit?: number;
}
