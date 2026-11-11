/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateOverviewDto } from './create-overview.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateOverviewDto extends PartialType(CreateOverviewDto) {
  @IsString() @IsOptional() updatedBy?: string;
}