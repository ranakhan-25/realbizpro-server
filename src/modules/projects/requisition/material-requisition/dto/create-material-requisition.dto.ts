import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  ApprovalLayerStatus,
  MaterialRequisitionStatus,
} from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { NestedMaterialRequisitionItemDto } from '../../material-requisition-item/dto/nested-material-requisition-item.dto';

export class CreateMaterialRequisitionDto {
  @ApiProperty({ example: '2026-10-12' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: '2026-10-20' })
  @IsDateString()
  @IsOptional()
  demandDate?: string;

  @ApiProperty({ example: 'REC00097' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'REF-001' })
  @IsString()
  @IsOptional()
  ref?: string;

  @ApiPropertyOptional({ example: 'Residential' })
  @IsString()
  @IsOptional()
  projectType?: string;

  @ApiPropertyOptional({
    description:
      'An existing Project.uuid (not Project.id)',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    example: 'Bricks Works',
  })
  @IsString()
  @IsOptional()
  titleNameOfWork?: string;

  @ApiPropertyOptional({ example: 'task-001' })
  @IsString()
  @IsOptional()
  ifTask?: string;

  @ApiPropertyOptional({
    description: 'An existing Site.uuid',
    example:
      '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  @IsOptional()
  siteId?: string;

  @ApiPropertyOptional({
    description: 'Category UUID',
    example:
      '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'Required for block A.',
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: 15000 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  total?: number;

  @ApiPropertyOptional({
    example: 'uploads/materials.pdf',
  })
  @IsString()
  @IsOptional()
  attachment?: string;

  @ApiPropertyOptional({
    enum: ApprovalLayerStatus,
    example: ApprovalLayerStatus.PENDING,
  })
  @IsEnum(ApprovalLayerStatus)
  @IsOptional()
  approvalLayer?: ApprovalLayerStatus;

  @ApiPropertyOptional({
    enum: MaterialRequisitionStatus,
    example: MaterialRequisitionStatus.PENDING,
  })
  @IsEnum(MaterialRequisitionStatus)
  @IsOptional()
  status?: MaterialRequisitionStatus;

  @ApiPropertyOptional({
    type: [NestedMaterialRequisitionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedMaterialRequisitionItemDto)
  @IsOptional()
  items?: NestedMaterialRequisitionItemDto[];
}
