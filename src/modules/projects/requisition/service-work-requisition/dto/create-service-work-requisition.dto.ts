import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ServiceWorkRequisitionStatus } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';

export class CreateServiceWorkRequisitionDto {
  @IsDateString()
  @IsNotEmpty()
  requisitionDate: string;

  @IsString()
  @IsNotEmpty()
  requisitionCode: string;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  @IsOptional()
  targetProjectId?: string;

  @IsString()
  @IsOptional()
  titleOrWorkNameId?: string;

  @IsString()
  @IsOptional()
  taskSubcategory?: string;

  @IsString()
  @IsOptional()
  constructionSiteId?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  subtotalAmount?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  grandTotalPayable?: number;

  @IsString()
  @IsOptional()
  supportingAttachment?: string;

  @IsString()
  @IsOptional()
  addedById?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  deletedBy?: string;

  @IsEnum(ServiceWorkRequisitionStatus)
  @IsOptional()
  status?: ServiceWorkRequisitionStatus;
}
