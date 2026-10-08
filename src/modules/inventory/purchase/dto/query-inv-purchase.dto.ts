import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class QueryInvPurchaseDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by Supplier UUID', example: 'uuid' })
  @IsOptional()
  @IsString()
  supplier_id?: string;

  @ApiPropertyOptional({ description: 'Filter by Project UUID', example: 'uuid' })
  @IsOptional()
  @IsString()
  project_id?: string;
}
