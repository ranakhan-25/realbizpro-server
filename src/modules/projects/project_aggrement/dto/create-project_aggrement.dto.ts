/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  IsISO8601,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AgreementType,
  AgreementStatus,
} from 'src/database/models/projects/project_aggrement/pr_project_aggrement_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectAgreementDto {
  @IsUUID()
  projectUuid: string;

  @IsUUID()
  partyUuid: string;

  @IsString()
  agreementCode: string;

  @IsEnum(AgreementType)
  agreementType: AgreementType;

  @IsISO8601({ strict: true })
  signedDate: string;

  @IsISO8601({ strict: true })
  startDate: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  contractValue: number;

  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @IsString()
  @IsOptional()
  agreementFile?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}