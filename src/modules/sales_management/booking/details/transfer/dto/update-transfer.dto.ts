/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferDto } from './create-transfer.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {
  @IsString() @IsOptional() updatedBy?: string;
}