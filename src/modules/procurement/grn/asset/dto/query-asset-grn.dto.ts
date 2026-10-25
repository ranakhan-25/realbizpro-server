import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProcurementAssetGrnApprovalLayer, ProcurementAssetGrnStatus } from 'src/database/models/procurement/grn/pr_asset_grn.model';

export class QueryAssetGrnDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1, description: 'Page number' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 200, description: 'Rows per page' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit = 10;

  @ApiPropertyOptional({ type: String, description: 'Search by GRN code, reference, or ledger name' })
  @IsOptional() @IsString() search?: string;

  @ApiPropertyOptional({ type: String, format: 'date', description: 'Inclusive start date (YYYY-MM-DD)' })
  @IsOptional() @IsDateString() date_from?: string;

  @ApiPropertyOptional({ type: String, format: 'date', description: 'Inclusive end date (YYYY-MM-DD)' })
  @IsOptional() @IsDateString() date_to?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() supplier_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() project_type_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() project_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() title_of_work_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() task_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() site_id?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @IsOptional() @IsUUID() category_id?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() ledger_id?: string;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) added_by_id?: number;

  @ApiPropertyOptional({ enum: ProcurementAssetGrnApprovalLayer })
  @IsOptional() @IsEnum(ProcurementAssetGrnApprovalLayer) approval_layer?: ProcurementAssetGrnApprovalLayer;

  @ApiPropertyOptional({ enum: ProcurementAssetGrnStatus })
  @IsOptional() @IsEnum(ProcurementAssetGrnStatus) status?: ProcurementAssetGrnStatus;
}
