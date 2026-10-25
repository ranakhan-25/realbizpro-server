import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLeadCategoryDto {
  @ApiPropertyOptional({ description: 'Category code; generated when omitted', example: 'LC5589255' })
  @IsOptional() @IsString() @MaxLength(100)
  declare code?: string;

  @ApiProperty({ description: 'Lead category name', example: 'Land share', maxLength: 150 })
  @IsString() @IsNotEmpty() @MaxLength(150)
  declare name: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Description of this lead category' })
  @IsOptional() @IsString()
  declare description?: string;

  @ApiPropertyOptional({ description: 'UUID or display name of the user adding this category' })
  @IsOptional() @IsString()
  declare createdBy?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  declare isActive?: boolean;
}
