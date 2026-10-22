/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AccountCreationType } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';


export class CreateCategoryAccountMappingDto {
  @ApiProperty({
    description: 'Inventory Account Type',
    enum: AccountCreationType,
    example: AccountCreationType.CREATE_NEW,
  })
  @IsEnum(AccountCreationType)
  inventoryAccountType: AccountCreationType;

  @ApiPropertyOptional({
    description:
      'Inventory Account Group Code (if Create New)',
    example: '100-001-001',
  })
  @IsOptional()
  @IsString()
  inventoryAccountGroupCode?: string;

  @ApiPropertyOptional({
    description:
      'Existing Inventory Account ID (if Existing)',
    example: 'account-uuid',
  })
  @IsOptional()
  @IsString()
  existingInventoryAccountId?: string;

  @ApiProperty({
    description: 'Consumption Account Type',
    enum: AccountCreationType,
    example: AccountCreationType.CREATE_NEW,
  })
  @IsEnum(AccountCreationType)
  consumptionAccountType: AccountCreationType;

  @ApiPropertyOptional({
    description:
      'Consumption Account Group Code (if Create New)',
    example: '500-001-001',
  })
  @IsOptional()
  @IsString()
  consumptionAccountGroupCode?: string;

  @ApiPropertyOptional({
    description:
      'Existing Consumption Account ID (if Existing)',
    example: 'account-uuid',
  })
  @IsOptional()
  @IsString()
  existingConsumptionAccountId?: string;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category Type',
    example: 'Material',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Unique Category Code',
    example: 'C7400109',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Category Name',
    example: 'Miscellaneous',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  addedById?: string;

  @ApiPropertyOptional({
    description: 'Account mapping details',
    type: CreateCategoryAccountMappingDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCategoryAccountMappingDto)
  accountMapping?: CreateCategoryAccountMappingDto;
}
