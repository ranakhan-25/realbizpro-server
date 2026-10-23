import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { HireOrderMode, HireOrderStatus } from 'src/database/models/procurement/equipment-hire/pr_hire_order.model';

export class HireOrderItemDto {
  @IsOptional() @IsUUID() equipment_id?: string;
  @IsOptional() @IsUUID() requisition_item_id?: string;
  @IsOptional() @IsUUID() unit_id?: string;
  @IsOptional() @IsString() equipment_description?: string;
  @IsOptional() @IsString() unit?: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @IsOptional() @IsString() charged_by?: string;
  @Type(() => Number) @IsNumber() @Min(0) rate: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) tax_percent?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) vat_percent?: number;
}
export class CreateHireOrderDto {
  @IsOptional() @IsString() hire_no?: string;
  @IsEnum(HireOrderMode) hire_mode: HireOrderMode;
  @IsOptional() @IsUUID() requisition_id?: string;
  @IsUUID() project_id: string;
  @IsOptional() @IsUUID() site_id?: string;
  @IsUUID() vendor_id: string;
  @IsDateString() hire_from: string;
  @IsOptional() @IsDateString() hire_to?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) shipping_cost?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) order_discount?: number;
  @IsOptional() @IsEnum(HireOrderStatus) status?: HireOrderStatus;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => HireOrderItemDto) items: HireOrderItemDto[];
}
export class QueryHireOrderDto {
  @IsOptional() @IsString() hire_no?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsEnum(HireOrderStatus) status?: HireOrderStatus;
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}
export class HireMovementItemDto {
  @IsUUID() hire_order_item_id: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() remarks?: string;
}
export class CreateHireInDto {
  @IsOptional() @IsString() hire_in_no?: string;
  @IsUUID() hire_order_id: string;
  @IsDateString() received_date: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => HireMovementItemDto) items: HireMovementItemDto[];
}
export class CreateHireOutDto {
  @IsOptional() @IsString() hire_out_no?: string;
  @IsUUID() hire_order_id: string;
  @IsDateString() return_date: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => HireMovementItemDto) items: HireMovementItemDto[];
}
export class HireBillItemDto {
  @IsUUID() hire_order_item_id: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0.001) quantity?: number;
}
export class CreateHireBillDto {
  @IsOptional() @IsString() bill_no?: string;
  @IsUUID() hire_order_id: string;
  @IsDateString() period_from: string;
  @IsDateString() period_to: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) carriage?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => HireBillItemDto) items?: HireBillItemDto[];
}
export class QueryHireMovementDto {
  @IsOptional() @IsString() number?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsUUID() hire_order_id?: string;
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}
export class QueryEquipmentSiteDto {
  @IsUUID() project_id: string;
}
