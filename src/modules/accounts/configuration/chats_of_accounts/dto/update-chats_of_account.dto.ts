/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateChartOfAccountDto } from './create-chats_of_account.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateChartOfAccountDto extends PartialType(
  OmitType(CreateChartOfAccountDto, ['code', 'addedBy', 'addedById'] as const)
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}