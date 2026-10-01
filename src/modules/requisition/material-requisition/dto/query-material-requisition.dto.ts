import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApprovalStatusEnum, RequisitionStatusEnum } from 'src/database/models/Requisition/re_material_requisition_model';
 // path adjust করো

export class QueryRequisitionDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by requisitionNo, titleOfWork, referenceNo, department',
    example: 'foundation',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: RequisitionStatusEnum,
    example: RequisitionStatusEnum.DRAFT,
  })
  @IsOptional()
  @IsEnum(RequisitionStatusEnum)
  status?: RequisitionStatusEnum;

  @ApiPropertyOptional({
    enum: ApprovalStatusEnum,
    example: ApprovalStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(ApprovalStatusEnum)
  approvalStatus?: ApprovalStatusEnum;

  @ApiPropertyOptional({
    description: 'Filter by Project ID',
    example: 'project-uuid',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Company ID',
    example: 'company-uuid',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  withDeleted?: boolean = false;
}