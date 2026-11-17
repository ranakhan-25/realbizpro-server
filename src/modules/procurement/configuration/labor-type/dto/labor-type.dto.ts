import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { LaborTypeStatus } from 'src/database/models/procurement/configuration/labor-type/pr_labor_type.model';

export class CreateLaborTypeDto {
  @ApiProperty({ example: 'Mason' }) @IsString() @IsNotEmpty() @MaxLength(150) name: string;
  @ApiProperty({ example: 'Person' }) @IsString() @IsNotEmpty() @MaxLength(80) unit: string;
  @ApiPropertyOptional({ enum: LaborTypeStatus, default: LaborTypeStatus.ACTIVE }) @IsOptional() @IsEnum(LaborTypeStatus) status?: LaborTypeStatus;
}

export class UpdateLaborTypeDto extends PartialType(CreateLaborTypeDto) {}

export class QueryLaborTypeDto {
  @ApiPropertyOptional({ description: 'Quick search by labor type name or unit' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: LaborTypeStatus }) @IsOptional() @IsEnum(LaborTypeStatus) status?: LaborTypeStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @Type(() => Number) limit?: number;
  @ApiPropertyOptional() @IsOptional() withDeleted?: boolean | string;
  @ApiPropertyOptional() @IsOptional() deleted_only?: boolean | string;
}