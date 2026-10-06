import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

// This class represents a single node in the menu tree
export class MenuTreeNodeDto {
  @ApiProperty({
    description: 'The ID of the menu item',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description:
      'Nested array of child menu items',
    type: () => [MenuTreeNodeDto], // For Swagger recursion
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuTreeNodeDto) // Important for class-validator to use this class for nested validation
  children?: MenuTreeNodeDto[];
}

// This is the main DTO for the request body
export class UpdateMenuTreeDto {
  @ApiProperty({
    description:
      'The ID of the module for which the menu tree is being updated',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({
    description:
      'An array representing the menu tree structure',
    type: [MenuTreeNodeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuTreeNodeDto)
  menuTree: MenuTreeNodeDto[];
}
