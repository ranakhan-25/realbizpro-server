import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementPurchaseOrderApprovalLayer, ProcurementPurchaseOrderStatus } from 'src/database/models/procurement/purchase-order/pr_purchase_order.model';

export class CreatePurchaseOrderItemDto {
  @ApiProperty({ description: 'Procurement item UUID' }) @IsUUID() item_id: string;
  @ApiProperty({ example: 1 }) @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @ApiPropertyOptional({ example: 100 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) rate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) budget_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) purchase_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock_qty?: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: '2026-10-22' }) @IsDateString() date: string;
  @ApiProperty({ description: 'SupplierAccounts UUID' }) @IsUUID() supplier_id: string;
  @ApiPropertyOptional({ example: 'PO00002' }) @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() company_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() requisition_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional({ description: 'HTML or plain-text content footer from the editor' }) @IsOptional() @IsString() content_footer?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) added_by_id?: number;
  @ApiPropertyOptional({ enum: ProcurementPurchaseOrderApprovalLayer }) @IsOptional() @IsEnum(ProcurementPurchaseOrderApprovalLayer) approval_layer?: ProcurementPurchaseOrderApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementPurchaseOrderStatus }) @IsOptional() @IsEnum(ProcurementPurchaseOrderStatus) status?: ProcurementPurchaseOrderStatus;
  @ApiProperty({ type: [CreatePurchaseOrderItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreatePurchaseOrderItemDto) items: CreatePurchaseOrderItemDto[];

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
