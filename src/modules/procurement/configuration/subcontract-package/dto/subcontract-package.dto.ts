import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubcontractPackageStatus } from 'src/database/models/procurement/configuration/subcontract-package/pr_subcontract_package.model';

export class CreateSubcontractPackageDto {
  @ApiProperty({ example: 'Electrical Work' }) @IsString() @IsNotEmpty() @MaxLength(150) name: string;
  @ApiProperty({ example: 'Lot' }) @IsString() @IsNotEmpty() @MaxLength(80) unit: string;
  @ApiPropertyOptional({ enum: SubcontractPackageStatus, default: SubcontractPackageStatus.ACTIVE }) @IsOptional() @IsEnum(SubcontractPackageStatus) status?: SubcontractPackageStatus;
  @ApiPropertyOptional({ example: 1, description: 'Organization ID' })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;
}

export class UpdateSubcontractPackageDto extends PartialType(CreateSubcontractPackageDto) {}

export class QuerySubcontractPackageDto {
  @ApiPropertyOptional({ description: 'Quick search by package name or unit' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: SubcontractPackageStatus }) @IsOptional() @IsEnum(SubcontractPackageStatus) status?: SubcontractPackageStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @Type(() => Number) limit?: number;
  @ApiPropertyOptional() @IsOptional() withDeleted?: boolean | string;
  @ApiPropertyOptional() @IsOptional() deleted_only?: boolean | string;
}
