import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateInvCategoryDto {
  @ApiProperty({ description: 'The unique code for the category', example: 'CAT-001' })
  @IsString()
  @IsNotEmpty()
  category_code: string;

  @ApiProperty({ description: 'The display name of the category', example: 'Raw Materials' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Inventory Chart of Group ID', example: 101 })
  @IsNumber()
  @IsOptional()
  inventory_cog_id?: number;

  @ApiPropertyOptional({ description: 'Inventory Chart of Account ID', example: 201 })
  @IsNumber()
  @IsOptional()
  inventory_coa_id?: number;

  @ApiPropertyOptional({ description: 'Consumption Chart of Group ID', example: 102 })
  @IsNumber()
  @IsOptional()
  consumption_cog_id?: number;

  @ApiPropertyOptional({ description: 'Consumption Chart of Account ID', example: 202 })
  @IsNumber()
  @IsOptional()
  consumption_coa_id?: number;

  @ApiPropertyOptional({ example: 'uuid', description: 'Created By ID' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Updated By ID' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Deleted By ID' })
  @IsOptional()
  @IsString()
  deletedBy?: string;
}

