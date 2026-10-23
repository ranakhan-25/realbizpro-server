import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementBoqCostType } from 'src/database/models/procurement/boq/pr_procurement_boq_item.model';
import { ProcurementBoqStatus } from 'src/database/models/procurement/boq/pr_procurement_boq.model';
export class ProcurementBoqItemDto {
  @IsOptional() @IsUUID() item_id?: string;
  @IsOptional() @IsUUID() category_id?: string;
  @IsOptional() @IsUUID() unit_id?: string;
  @IsString() item_name: string;
  @IsOptional() @IsString() item_code?: string;
  @IsOptional() @IsString() unit?: string;
  @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) rate: number;
  @IsOptional() @IsEnum(ProcurementBoqCostType) cost_type?: ProcurementBoqCostType;
  @IsOptional() @IsString() remarks?: string;
}
export class ProcurementBoqNoteDto {
  @IsString() note: string;
}
export class CreateProcurementBoqDto {
  @IsUUID() project_id: string;
  @IsOptional() @IsUUID() company_id?: string;
  @IsOptional() @Type(() => Number) @IsNumber() responsible_user_id?: number;
  @IsOptional() @IsString() responsible_person?: string;
  @IsString() title: string;
  @IsDateString() date: string;
  @IsDateString() due_date: string;
  @IsString() boq_type: string;
  @IsOptional() @IsEnum(ProcurementBoqStatus) status?: ProcurementBoqStatus;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) margin_overhead?: number;
  @IsOptional() @IsString() remarks?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ProcurementBoqItemDto) items: ProcurementBoqItemDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProcurementBoqNoteDto) important_notes?: ProcurementBoqNoteDto[];
}
export class UpdateProcurementBoqDto extends CreateProcurementBoqDto {}
export class QueryProcurementBoqDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsDateString() date_from?: string;
  @IsOptional() @IsDateString() date_to?: string;
  @IsOptional() @IsUUID() project_id?: string;
  @IsOptional() @IsUUID() company_id?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}
export class ImportProcurementBoqDto {
  @IsUUID() project_id: string;
  @IsOptional() @IsUUID() company_id?: string;
  @IsString() title: string;
  @IsDateString() date: string;
  @IsDateString() due_date: string;
  @IsString() boq_type: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) margin_overhead?: number;
}
