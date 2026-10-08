/* eslint-disable prettier/prettier */

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ApprovalStatus } from 'src/database/models/projects/Requisition/pr_material_requisition_model';


export class CreateMaterialRequisitionDto {
  @ApiProperty({
    example: 'Real Estate',
    description: 'Project type',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  projectType: string;

  @ApiProperty({
    example: 'Main Office Building Project',
    description: 'Project name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  projectName: string;

  @ApiProperty({
    example:
      'Construction of Main Office Building',
    description: 'Title or name of work',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleOrNameOfWork: string;

  @ApiProperty({
    example: 'REQ-2026-0001',
    description: 'Unique requisition code',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  code: string;

  @ApiProperty({
    example: 'REF-2026-001',
    description: 'Reference number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  referenceNumber: string;

  @ApiProperty({
    example: '2026-10-15',
    description: 'Demand date',
  })
  @IsDateString()
  @IsNotEmpty()
  demandDate: string;

  @ApiProperty({
    example: 'company-uuid-123',
    description: 'Company ID or reference',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  company: string;

  @ApiPropertyOptional({
    example: 'supplier-uuid-123',
    description: 'Supplier ID or reference',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  supplier?: string;

  @ApiPropertyOptional({
    example:
      'https://example.com/files/requisition.pdf',
    description: 'Attachment URL',
  })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-123',
    description: 'User who added the requisition',
  })
  @IsOptional()
  @IsString()
  addedBy?: string;

  @ApiPropertyOptional({
    example: 'PENDING',
    description: 'Approval layer',
  })
  @IsOptional()
  @IsString()
  approvalLayer?: string;

  @ApiPropertyOptional({
    enum: ApprovalStatus,
    example: ApprovalStatus.PENDING,
    description: 'Requisition status',
  })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;

  @ApiPropertyOptional({
    example: 'user-uuid-123',
    description: 'User who created the record',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-123',
    description:
      'User who last updated the record',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-123',
    description: 'User who deleted the record',
  })
  @IsOptional()
  @IsString()
  deletedBy?: string;
}
