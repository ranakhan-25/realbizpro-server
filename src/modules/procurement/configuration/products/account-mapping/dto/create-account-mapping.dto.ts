/* eslint-disable prettier/prettier */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountCreationType } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';


export class CreateAccountMappingDto {
  @ApiProperty({
    description: 'Category UUID',
    example: 'category-uuid',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

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

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  addedById?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
  @IsOptional()
  orgId?: number;

  @ApiPropertyOptional({ description: 'Project UUID or ID' })
  @IsOptional()
  projectId?: string;

}
