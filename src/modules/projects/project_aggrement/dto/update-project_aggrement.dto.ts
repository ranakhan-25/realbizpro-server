/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProjectAgreementDto } from './create-project_aggrement.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProjectAgreementDto extends PartialType(
  OmitType(CreateProjectAgreementDto, ['projectUuid', 'agreementCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}