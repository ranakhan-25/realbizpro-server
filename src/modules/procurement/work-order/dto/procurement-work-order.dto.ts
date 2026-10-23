import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementWorkOrderMode, ProcurementWorkOrderStatus, ProcurementWorkOrderType } from 'src/database/models/procurement/work-order/pr_procurement_work_order.model';

export class ProcurementWorkOrderItemDto {
  @IsOptional() @IsUUID() requisition_item_id?: string;
  @IsString() description: string;
  @IsOptional() @IsString() unit?: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) rate: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) tax_percent?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) vat_percent?: number;
}

export class CreateProcurementWorkOrderDto {
  @IsString() title: string;
  @IsEnum(ProcurementWorkOrderMode) mode: ProcurementWorkOrderMode;
  @IsEnum(ProcurementWorkOrderType) type: ProcurementWorkOrderType;
  @IsOptional() @IsUUID() requisition_id?: string;
  @IsUUID() project_id: string;
  @IsUUID() subcontractor_id: string;
  @IsOptional() @IsDateString() start_date?: string;
  @IsOptional() @IsDateString() end_date?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) order_discount?: number;
  @IsOptional() @IsEnum(ProcurementWorkOrderStatus) status?: ProcurementWorkOrderStatus;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ProcurementWorkOrderItemDto) items: ProcurementWorkOrderItemDto[];
}

export class QueryProcurementWorkOrderDto {
  @IsOptional() @IsString() work_order_no?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsEnum(ProcurementWorkOrderType) type?: ProcurementWorkOrderType;
  @IsOptional() @IsEnum(ProcurementWorkOrderStatus) status?: ProcurementWorkOrderStatus;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;
}
