import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

// Define a DTO for the module property
export class ModuleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Module ID',
  })
  id: number;

  @ApiProperty({
    example: 'User Management',
    description: 'Module name',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Handles user and role management',
    description: 'Module description',
  })
  description?: string;
}

// Define a DTO for the permission property
export class PermissionResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Permission ID',
  })
  id: number;

  @ApiProperty({
    example: 'menu.read',
    description: 'Permission key',
  })
  key: string;

  @ApiPropertyOptional({
    example: 'Can view menu',
    description: 'Permission description',
  })
  description?: string;
}

export class MenuResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Menu ID',
  })
  id: number;

  @ApiProperty({
    example: 'Dashboard',
    description: 'Menu title',
  })
  title: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Menu URL',
  })
  url: string;

  @ApiPropertyOptional({
    example: '_self',
    description: 'Target attribute for link',
  })
  target?: string;

  //order
  @ApiProperty({
    example: 1,
    description: 'Module order',
  })
  order?: number;

  @ApiPropertyOptional({
    example: 'SIDEBAR',
    description: 'Menu location',
  })
  location?: string;

  @ApiPropertyOptional({
    example: 'menu-icon-class',
    description: 'CSS class for the menu item',
  })
  elementClass?: string;

  @ApiPropertyOptional({
    example: 'menu-item-id',
    description:
      'HTML id attribute for the menu item',
  })
  elementId?: string;

  @ApiPropertyOptional({
    example: '<svg>...</svg>',
    description: 'Menu icon (SVG or class)',
  })
  icon?: string;

  @ApiPropertyOptional({
    example: 'Main dashboard menu',
    description: 'Menu description',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Parent menu ID',
  })
  parentId?: number;

  @ApiProperty({
    example: true,
    description: 'Is menu visible',
  })
  isVisible: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Menu module ID',
  })
  moduleId?: number;

  @ApiPropertyOptional({
    type: () => MenuResponseDto,
    description: 'Parent menu',
  })
  parent?: Partial<MenuResponseDto>;

  @ApiPropertyOptional({
    type: [MenuResponseDto],
    description: 'Child menus',
  })
  children?: MenuResponseDto[];

  @ApiPropertyOptional({
    type: () => ModuleResponseDto,
    description: 'Menu module',
  })
  module?: ModuleResponseDto;

  @ApiPropertyOptional({
    type: [PermissionResponseDto],
    description: 'Permissions for this menu',
  })
  permissions?: PermissionResponseDto[];
}

export class ModuleWithMenuTreeResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Module ID',
  })
  moduleId: number;

  @ApiProperty({
    example: 'User Management',
    description: 'Module name',
  })
  moduleName: string;

  @ApiPropertyOptional({
    example: 'Handles user and role management',
    description: 'Module description',
  })
  moduleDescription?: string;

  @ApiProperty({
    type: [MenuResponseDto],
    description: 'Menu tree for this module',
  })
  menuTree: MenuResponseDto[];
}
