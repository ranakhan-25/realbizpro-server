/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';

import { IsString, IsOptional } from 'class-validator';
import { CreateProjectPartyDto } from './create-project_party.dto';

export class UpdateProjectPartyDto extends PartialType(
  OmitType(CreateProjectPartyDto, ['projectUuid', 'partyCode', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}