/* eslint-disable prettier/prettier */

import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateChartOfGroupDto } from './create-chats_of_groupe.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateChartOfGroupDto extends PartialType(
OmitType(CreateChartOfGroupDto, ['addedBy', 'addedById'] as const),
) {
@IsString()
@IsOptional()
updatedBy?: string;
}
