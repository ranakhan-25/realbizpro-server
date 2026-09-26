import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SysMenuLocation } from '../../../database/models/system/sys_menu.model';
import { Transform } from 'class-transformer';

export class CreateMenuDto {
  @ApiProperty({
    example: 'Dashboard',
    description: 'Menu title',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Menu URL',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  url: string;

  @ApiPropertyOptional({
    example: '_self',
    description: 'Target attribute for link',
  })
  @IsString()
  @IsOptional()
  target?: string;

  @ApiPropertyOptional({
    example: [
      'SIDEBAR',
      'HEADER',
      'FOOTER',
      'NOTFOUND',
    ],
    description: 'Menu locations',
    type: [String],
  })
  @IsArray()
  @IsEnum(SysMenuLocation, { each: true })
  @IsOptional()
  location?: SysMenuLocation[];

  @ApiPropertyOptional({
    example: 'menu-icon-class',
    description: 'CSS class for the menu item',
  })
  @IsString()
  @IsOptional()
  elementClass?: string;

  @ApiPropertyOptional({
    example: 'menu-item-id',
    description:
      'HTML id attribute for the menu item',
  })
  @IsString()
  @IsOptional()
  elementId?: string;

  @ApiPropertyOptional({
    example: '<svg>...</svg>',
    description: 'Menu icon (SVG or class)',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  //isVisible field with transform
  @ApiPropertyOptional({
    example: true,
    description: 'Is the menu visible?',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    } else if (
      value === 'false' ||
      value === false
    ) {
      return false;
    }
    return true;
  })
  @IsBoolean()
  isVisible?: boolean = true;

  @ApiPropertyOptional({
    example: 'Main dashboard menu',
    description: 'Menu description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Menu order for sorting',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Parent menu ID',
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Menu module ID',
  })
  @IsNumber()
  @IsOptional()
  moduleId?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description:
      'Array of permission IDs to assign to this menu',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permissionIds?: number[];
}
