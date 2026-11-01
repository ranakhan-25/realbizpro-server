/* eslint-disable prettier/prettier */

import {
IsString,
IsOptional,
IsNumber,
IsBoolean,
IsUUID,
Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateChartOfAccountDto {
@IsUUID()
chartOfGroupUuid: string;

@IsString()
code: string;

@IsString()
name: string;

@IsNumber()
@Min(0)
@IsOptional()
@Type(() => Number)
openingBalance?: number;

@IsString()
under: string;

@IsBoolean()
@IsOptional()
hasDelete?: boolean;

@IsString()
@IsOptional()
addedBy?: string;

@IsString()
@IsOptional()
addedById?: string;
}
