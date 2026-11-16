import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateCrWaiverDto {
  @ApiProperty({ example: 1, description: 'Sale Agreement ID' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sale_agreement_id: number;

  @ApiProperty({ example: 3, description: 'Installment Plan ID with overdue delay penalty' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  installment_plan_id: number;

  @ApiProperty({ example: 12000, description: 'Requested waiver amount in BDT' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  requested_amount: number;

  @ApiProperty({ example: 'Customer was hospitalized during payment window, medical certificate attached', description: 'Justification for penalty waiver' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'https://cdn.realbiz.com/docs/medical_cert.pdf', description: 'Supporting document attachment URL' })
  @IsString()
  @IsOptional()
  attachment_url?: string;

  @ApiPropertyOptional({ example: 'PRJ-101' })
  @IsString()
  @IsOptional()
  org_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCrWaiverStatusDto {
  @ApiProperty({
    example: 'approved',
    enum: ['approved', 'rejected'],
    description: 'Decision status for the penalty waiver request',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['approved', 'rejected'])
  approval_status: string;

  @ApiPropertyOptional({ example: 10000, description: 'Approved waiver amount in BDT (may be full or partial)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  approved_amount?: number;

  @ApiPropertyOptional({ example: 'Approved 10,000 BDT waiver by Head of Finance per humanitarian exception', description: 'Approver remarks' })
  @IsString()
  @IsOptional()
  approval_remarks?: string;

  @ApiPropertyOptional({ example: 'EMP-0012', description: 'Approver employee ID' })
  @IsString()
  @IsOptional()
  approver_id?: string;

  @ApiPropertyOptional({ example: 'S. K. Anwar', description: 'Approver full name' })
  @IsString()
  @IsOptional()
  approver_name?: string;
}
