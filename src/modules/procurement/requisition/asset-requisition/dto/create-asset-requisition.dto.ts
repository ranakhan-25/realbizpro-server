import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ProcurementAssetRequisitionApprovalLayer, ProcurementAssetRequisitionStatus } from 'src/database/models/procurement/requisition/pr_asset_requisition.model';

export class CreateAssetRequisitionItemDto {
  @ApiProperty({ description: 'Asset item UUID' }) @IsUUID() item_id: string;
  @ApiProperty({ example: 2 }) @Type(() => Number) @IsNumber() @Min(0) demand_qty: number;
  @ApiPropertyOptional() @IsOptional() @IsString() details?: string;
}

export class CreateAssetRequisitionDto {
  @ApiProperty({ example: '2026-10-22' }) @IsDateString() date: string;
  @ApiPropertyOptional({ example: '2026-10-29' }) @IsOptional() @IsDateString() demand_date?: string;
  @ApiPropertyOptional({ example: 'AR00001' }) @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ref?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() company_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() supplier_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_type_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() project_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() title_of_work_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() task_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() site_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) added_by_id?: number;
  @ApiPropertyOptional({ enum: ProcurementAssetRequisitionApprovalLayer }) @IsOptional() @IsEnum(ProcurementAssetRequisitionApprovalLayer) approval_layer?: ProcurementAssetRequisitionApprovalLayer;
  @ApiPropertyOptional({ enum: ProcurementAssetRequisitionStatus }) @IsOptional() @IsEnum(ProcurementAssetRequisitionStatus) status?: ProcurementAssetRequisitionStatus;
  @ApiProperty({ type: [CreateAssetRequisitionItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateAssetRequisitionItemDto) items: CreateAssetRequisitionItemDto[];
}
