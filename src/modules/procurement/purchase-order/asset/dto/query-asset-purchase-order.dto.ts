import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProcurementAssetPurchaseOrderApprovalLayer, ProcurementAssetPurchaseOrderStatus } from 'src/database/models/procurement/purchase-order/pr_asset_purchase_order.model';
export class QueryAssetPurchaseOrderDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit = 10;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
  @IsOptional() @IsUUID() company_id?: string;
  @IsOptional() @IsUUID() supplier_id?: string;
  @IsOptional() @IsUUID() project_type_id?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsUUID() title_of_work_id?: string;
  @IsOptional() @Type(() => Number) @IsInt() added_by_id?: number;
  @IsOptional() @IsEnum(ProcurementAssetPurchaseOrderApprovalLayer) approval_layer?: ProcurementAssetPurchaseOrderApprovalLayer;
  @IsOptional() @IsEnum(ProcurementAssetPurchaseOrderStatus) status?: ProcurementAssetPurchaseOrderStatus;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
