import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProcurementMaterialRequisitionApprovalLayer, ProcurementMaterialRequisitionStatus } from 'src/database/models/procurement/requisition/pr_material_requisition.model';
export class QueryProcurementMaterialRequisitionDto {
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
  @IsOptional() @IsEnum(ProcurementMaterialRequisitionApprovalLayer) approval_layer?: ProcurementMaterialRequisitionApprovalLayer;
  @IsOptional() @IsEnum(ProcurementMaterialRequisitionStatus) status?: ProcurementMaterialRequisitionStatus;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
