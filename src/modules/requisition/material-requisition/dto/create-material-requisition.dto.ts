/* eslint-disable prettier/prettier */
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Transform,
  Type,
} from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ApprovalStatusEnum,
  RequisitionStatusEnum,
} from 'src/database/models/projects/Requisition/re_material_requisition_model';
// path adjust করো

export class CreateMaterialRequisitionDto {
  @ApiProperty({
    description:
      'Unique requisition number (shown as code in UI)',
    example: 'taiz00017',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Requisition number is required',
  })
  @MaxLength(100)
  requisitionNo: string;

  @ApiPropertyOptional({
    description: 'Reference number',
    example: 'REF-9921',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  referenceNo?: string;

  @ApiPropertyOptional({
    description: 'Requisition date',
    example: '2026-10-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message:
      'requisitionDate must be a valid date',
  })
  requisitionDate?: Date;

  @ApiPropertyOptional({
    description: 'Demand date',
    example: '2026-10-15T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: 'demandDate must be a valid date',
  })
  demandDate?: Date;

  @ApiPropertyOptional({
    description: 'Company ID',
    example: 'company-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  companyId?: string;

  @ApiProperty({
    description: 'Project ID',
    example: 'project-uuid',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Project ID is required',
  })
  projectId: string;

  @ApiProperty({
    description: 'Title / Name of Work',
    example: 'Foundation Work',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Title of work is required',
  })
  @MaxLength(255)
  titleOfWork: string;

  @ApiPropertyOptional({
    description: 'Department',
    example: 'Civil',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  department?: string;

  @ApiPropertyOptional({
    description: 'Added By User ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Approval status',
    enum: ApprovalStatusEnum,
    default: ApprovalStatusEnum.PENDING,
    example: ApprovalStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(ApprovalStatusEnum, {
    message: `approvalStatus must be one of: ${Object.values(ApprovalStatusEnum).join(', ')}`,
  })
  approvalStatus?: ApprovalStatusEnum;

  @ApiPropertyOptional({
    description: 'Attachment URL',
    example: 'https://example.com/file.pdf',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  attachmentUrl?: string;

  @ApiPropertyOptional({
    description: 'Requisition status',
    enum: RequisitionStatusEnum,
    default: RequisitionStatusEnum.DRAFT,
    example: RequisitionStatusEnum.DRAFT,
  })
  @IsOptional()
  @IsEnum(RequisitionStatusEnum, {
    message: `status must be one of: ${Object.values(RequisitionStatusEnum).join(', ')}`,
  })
  status?: RequisitionStatusEnum;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Urgent requirement',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  remarks?: string;
}
