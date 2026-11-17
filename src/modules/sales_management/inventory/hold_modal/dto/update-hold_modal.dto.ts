/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateHoldPropertyDto } from './create-hold_modal.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { HoldStatus } from '../../../../../database/models/sales_management/sm_hold-property.model';

export class UpdateHoldPropertyDto extends PartialType(CreateHoldPropertyDto) {
  @IsEnum(HoldStatus)
  @IsOptional()
  status?: HoldStatus;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}