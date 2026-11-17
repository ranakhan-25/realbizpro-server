/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgreementDto } from './create-agreement.dto';
import {
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateAgreementDto extends PartialType(
  CreateAgreementDto,
) {
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
