import { Type } from 'class-transformer';
import { IsBooleanString, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProcurementGrnApprovalLayer, ProcurementGrnStatus } from 'src/database/models/procurement/grn/pr_grn.model';

export class QueryGrnDto {
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
  @IsOptional() @IsUUID() task_id?: string;
  @IsOptional() @Type(() => Number) @IsInt() added_by_id?: number;
  @IsOptional() @IsEnum(ProcurementGrnApprovalLayer) approval_layer?: ProcurementGrnApprovalLayer;
  @IsOptional() @IsEnum(ProcurementGrnStatus) status?: ProcurementGrnStatus;
  @IsOptional() @IsBooleanString() already_billed?: string;
  @IsOptional() withDeleted?: boolean | string;
  @IsOptional() deleted_only?: boolean | string;
}
