import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateItemEntryDto } from './create-item_entry.dto';


export class UpdateItemEntryDto extends PartialType(CreateItemEntryDto) {  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

}