/* eslint-disable prettier/prettier */

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ServiceWorkRequisitionStatus } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';

export class QueryServiceWorkRequisitionDto {
  @IsDateString()
  @IsOptional()
  requisitionDate?: string;

  @IsString()
  @IsOptional()
  requisitionCode?: string;

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

  @IsNumberString()
  @IsOptional()
  subtotalAmount?: string;

  @IsNumberString()
  @IsOptional()
  grandTotalPayable?: string;

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

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  @IsOptional()
  withDeleted?: boolean = false;
}
