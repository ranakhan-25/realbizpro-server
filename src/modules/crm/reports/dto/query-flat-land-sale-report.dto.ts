import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryFlatLandSaleReportDto {
  @ApiPropertyOptional({ description: 'Booking/sale date lower bound (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Booking/sale date upper bound (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  declare dateTo?: string;

  @ApiPropertyOptional({ description: 'Sales person UUID, user code, or name' })
  @IsOptional() @IsString()
  declare salesBy?: string;

  @ApiPropertyOptional({ description: 'Project team member UUID, name, or email' })
  @IsOptional() @IsString()
  declare teamId?: string;

  @ApiPropertyOptional({ description: 'Project UUID or project code' })
  @IsOptional() @IsString()
  declare projectId?: string;

  @ApiPropertyOptional({ description: 'Search all visible sale report fields' })
  @IsOptional() @IsString()
  declare search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  declare limit?: number;
}
