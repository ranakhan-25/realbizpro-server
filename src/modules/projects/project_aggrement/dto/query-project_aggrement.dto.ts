/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumberString,
  IsIn
} from 'class-validator';
import {
  AgreementType,
  AgreementStatus,
} from 'src/database/models/projects/project_aggrement/pr_project_aggrement_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryProjectAgreementDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsUUID()
  @IsOptional()
  partyUuid?: string;

  @IsEnum(AgreementType)
  @IsOptional()
  agreementType?: AgreementType;

  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsIn(['agreementCode', 'agreementType', 'signedDate', 'startDate', 'contractValue', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}