import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class QueryInterestedFlatLandReportDto {
  @ApiPropertyOptional({ description: 'Project UUID from the dropdown API' })
  @IsOptional() @IsUUID() declare projectId?: string;

  @ApiPropertyOptional({ description: 'Flat/Land UUID from the dropdown API' })
  @IsOptional() @IsUUID() declare flatLandId?: string;

  @ApiPropertyOptional({ description: 'Search lead, lead code, project or flat/land number' })
  @IsOptional() @IsString() declare search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;

  @ApiPropertyOptional({ example: 10, default: 10, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;

  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  declare orgId?: number;
}
