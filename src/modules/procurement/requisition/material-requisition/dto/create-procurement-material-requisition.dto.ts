import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementMaterialRequisitionApprovalLayer, ProcurementMaterialRequisitionStatus } from 'src/database/models/procurement/requisition/pr_material_requisition.model';

export class CreateProcurementMaterialRequisitionItemDto {
  @ApiProperty({ example: 'ITEM-001' }) @IsString() item_code: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() item_id?: string;
  @ApiPropertyOptional({ example: 'Cement Bag' }) @IsOptional() @IsString() item_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() unit_id?: string;
  @ApiPropertyOptional({ example: 'Bag' }) @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional({ example: 100 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) budget_qty?: number;
  @ApiPropertyOptional({ example: 20 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) already_purchase_qty?: number;
  @ApiPropertyOptional({ example: 80 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) available_qty?: number;
  @ApiProperty({ example: 30 }) @Type(() => Number) @IsNumber() @Min(0) demand_qty: number;
  @ApiPropertyOptional({ example: 50 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock?: number;
}

export class CreateProcurementMaterialRequisitionDto {
  @ApiProperty({ example: '2026-10-22' }) @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() demand_date?: string;
  @ApiPropertyOptional({ example: 'REC00104' }) @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ref?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() company_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() supplier_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) added_by_id?: number;
  @ApiPropertyOptional({ enum: ProcurementMaterialRequisitionApprovalLayer }) @IsOptional() @IsEnum(ProcurementMaterialRequisitionApprovalLayer) approval_layer?: ProcurementMaterialRequisitionApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementMaterialRequisitionStatus }) @IsOptional() @IsEnum(ProcurementMaterialRequisitionStatus) status?: ProcurementMaterialRequisitionStatus;
  @ApiProperty({ type: [CreateProcurementMaterialRequisitionItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateProcurementMaterialRequisitionItemDto) items: CreateProcurementMaterialRequisitionItemDto[];
}
