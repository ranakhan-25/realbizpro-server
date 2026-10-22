import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProcurementAssetGrnApprovalLayer, ProcurementAssetGrnStatus } from 'src/database/models/procurement/grn/pr_asset_grn.model';

export class QueryAssetGrnDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit = 10;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
  @IsOptional() @IsUUID() supplier_id?: string;
  @IsOptional() @IsUUID() project_type_id?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsUUID() title_of_work_id?: string;
  @IsOptional() @IsUUID() task_id?: string;
  @IsOptional() @IsUUID() site_id?: string;
  @IsOptional() @IsUUID() category_id?: string;
  @IsOptional() @IsString() ledger_id?: string;
  @IsOptional() @Type(() => Number) @IsInt() added_by_id?: number;
  @IsOptional() @IsEnum(ProcurementAssetGrnApprovalLayer) approval_layer?: ProcurementAssetGrnApprovalLayer;
  @IsOptional() @IsEnum(ProcurementAssetGrnStatus) status?: ProcurementAssetGrnStatus;
}
