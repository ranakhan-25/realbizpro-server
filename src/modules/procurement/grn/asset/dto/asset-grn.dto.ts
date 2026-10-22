import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementAssetGrnApprovalLayer, ProcurementAssetGrnStatus } from 'src/database/models/procurement/grn/pr_asset_grn.model';

export class AssetGrnItemDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() item_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() item_code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() item_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() unit_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiProperty({ minimum: 0 }) @Type(() => Number) @IsNumber() @Min(0) quantity!: number;
  @ApiProperty({ minimum: 0 }) @Type(() => Number) @IsNumber() @Min(0) rate!: number;
}

export class CreateAssetGrnDto {
  @ApiProperty({ example: '2026-10-22' }) @IsDateString() date!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiProperty() @IsUUID() supplier_id!: string;
  @ApiPropertyOptional({ description: 'Selected account identifier from the accounting system' }) @IsOptional() @IsString() ledger_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ledger_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional({ minimum: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
  @ApiPropertyOptional({ minimum: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) paid?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional({ enum: ProcurementAssetGrnApprovalLayer }) @IsOptional() @IsEnum(ProcurementAssetGrnApprovalLayer) approval_layer?: ProcurementAssetGrnApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementAssetGrnStatus }) @IsOptional() @IsEnum(ProcurementAssetGrnStatus) status?: ProcurementAssetGrnStatus;
  @ApiProperty({ type: [AssetGrnItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => AssetGrnItemDto) items!: AssetGrnItemDto[];
}

export class UpdateAssetGrnDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() supplier_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ledger_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ledger_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional({ minimum: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
  @ApiPropertyOptional({ minimum: 0 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) paid?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional({ enum: ProcurementAssetGrnApprovalLayer }) @IsOptional() @IsEnum(ProcurementAssetGrnApprovalLayer) approval_layer?: ProcurementAssetGrnApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementAssetGrnStatus }) @IsOptional() @IsEnum(ProcurementAssetGrnStatus) status?: ProcurementAssetGrnStatus;
  @ApiPropertyOptional({ type: [AssetGrnItemDto] }) @IsOptional() @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => AssetGrnItemDto) items?: AssetGrnItemDto[];
}
