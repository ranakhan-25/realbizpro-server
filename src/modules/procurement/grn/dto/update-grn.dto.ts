import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementGrnApprovalLayer, ProcurementGrnStatus } from 'src/database/models/procurement/grn/pr_grn.model';

export class UpdateGrnItemDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() item_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() purchase_order_item_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() item_code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() item_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() unit_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) quantity?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) rate?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) budget_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) purchase_qty?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock_qty?: number;
}

export class UpdateGrnDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() company_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() supplier_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() purchase_order_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() requisition_id?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) paid?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() already_billed?: boolean;
  @ApiPropertyOptional({ enum: ProcurementGrnApprovalLayer }) @IsOptional() @IsEnum(ProcurementGrnApprovalLayer) approval_layer?: ProcurementGrnApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementGrnStatus }) @IsOptional() @IsEnum(ProcurementGrnStatus) status?: ProcurementGrnStatus;
  @ApiPropertyOptional({ type: [UpdateGrnItemDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => UpdateGrnItemDto) items?: UpdateGrnItemDto[];
}
