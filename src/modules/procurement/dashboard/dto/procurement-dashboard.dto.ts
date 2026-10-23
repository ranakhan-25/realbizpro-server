import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';

export enum ProcurementDashboardPeriod { TODAY = 'today', WEEKLY = 'weekly', MONTHLY = 'monthly', YEARLY = 'yearly', ALL = 'all' }

export class ProcurementDashboardQueryDto {
  @ApiPropertyOptional({ enum: ProcurementDashboardPeriod, default: ProcurementDashboardPeriod.MONTHLY })
  @IsOptional() @IsEnum(ProcurementDashboardPeriod) period?: ProcurementDashboardPeriod;
  @ApiPropertyOptional({ example: '2026-09-03' }) @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional({ example: '2026-10-03' }) @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional({ description: 'Search pending voucher by code, project or supplier' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ default: 8, minimum: 1, maximum: 50 }) @IsOptional() @Type(() => Number) @Min(1) @Max(50) limit?: number;
}
