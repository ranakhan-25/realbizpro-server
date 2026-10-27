import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryRequirementsReportDto {
  @ApiPropertyOptional({ description: 'User UUID or user code from the dropdown API' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Area database ID from the dropdown API' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare areaId?: number;

  @ApiPropertyOptional({ description: 'Requirement type database ID from the dropdown API' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare requirementTypeId?: number;

  @ApiPropertyOptional({ description: 'Search type, price, size, area, lead or description' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ example: 10, default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
}
