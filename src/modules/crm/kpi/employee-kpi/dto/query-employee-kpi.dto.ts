import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EmployeeKpiStatus, EmployeeKpiType } from './create-employee-kpi.dto';

export class QueryEmployeeKpiDto {
  @ApiPropertyOptional({ type: Number, default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) declare page?: number;
  @ApiPropertyOptional({ type: Number, default: 10, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) declare limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() declare search?: string;
  @ApiPropertyOptional({ enum: EmployeeKpiType }) @IsOptional() @IsEnum(EmployeeKpiType) declare type?: EmployeeKpiType;
  @ApiPropertyOptional({ enum: EmployeeKpiStatus }) @IsOptional() @IsEnum(EmployeeKpiStatus) declare status?: EmployeeKpiStatus;
  @ApiPropertyOptional({ type: Boolean, default: false }) @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() declare withDeleted?: boolean;
}
