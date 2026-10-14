import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Paginate,
  PaginateParams,
} from '../../common/decorators/paginate.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginateDto } from '../../common/dto/paginate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PaginateHelper } from '../../common/helper/paginate.helper';
import { SysMenuLocation } from '../../database/models/system/sys_menu.model';
import { CreateMenuDto } from './dto/create-menu.dto';
import { ModuleWithMenuTreeResponseDto } from './dto/response.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { UpdateMenuTreeDto } from './dto/update-position.dto';
import { MenuService } from './menu.service';

@ApiTags('System | Menu')
@Controller('menu')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
  ) {}

  @Post()
  @Permissions('create_menu')
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiBody({ type: CreateMenuDto })
  @ApiResponse({
    status: 201,
    description: 'Menu created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Menu URL already exists',
  })
  @ApiResponse({
    status: 404,
    description:
      'Parent menu or module not found',
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get('tree')
  // @Permissions('view_menus')
  @ApiOperation({
    summary: 'Get all menus in tree structure',
  })
  @ApiResponse({
    status: 200,
    description:
      'Menu tree retrieved successfully',
  })
  async findTree() {
    return this.menuService.findTree();
  }

  @Get()
  @Permissions('view_menus')
  @ApiOperation({
    summary: 'Get all menus with pagination',
  })
  @ApiQuery({ type: PaginateDto })
  @ApiResponse({
    status: 200,
    description: 'Menus retrieved successfully',
  })
  async findAll(
    @Paginate({ limit: 20, maxLimit: 500 })
    params: PaginateParams,
  ) {
    const [menus, total] =
      await this.menuService.findAndCount(params);
    return PaginateHelper.response(
      menus,
      total,
      params,
    );
  }

  @Get('modules-tree')
  @Permissions('view_menus')
  @ApiOperation({
    summary:
      'Get all modules with their menu trees',
    description:
      'Returns all modules with their hierarchical menu structures, optionally filtered by module ID and location',
  })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    type: Number,
    description: 'Filter by specific module ID',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    enum: SysMenuLocation,
    isArray: true,
    description:
      'Filter by menu locations (can specify multiple)',
    example: ['SIDEBAR', 'HEADER'],
  })
  @ApiResponse({
    status: 200,
    description:
      'All modules with menu trees retrieved successfully',
    type: [ModuleWithMenuTreeResponseDto],
  })
  async findAllModulesWithMenuTree(
    @Query('moduleId') moduleId?: string,
    @Query('location')
    location?:
      | SysMenuLocation
      | SysMenuLocation[],
  ): Promise<ModuleWithMenuTreeResponseDto[]> {
    const moduleIdNumber = moduleId
      ? +moduleId
      : undefined;

    // Handle location parameter - could be string or array
    let locationFilter:
      | SysMenuLocation
      | SysMenuLocation[]
      | undefined;
    if (location) {
      locationFilter = location;
    }
    console.log({
      locationFilter,
    });

    return this.menuService.findAllModulesWithMenuTree(
      moduleIdNumber,
      locationFilter,
    );
  }

  @Put('tree/order') // Using a new, more descriptive route
  @ApiOperation({
    summary:
      'Update the entire menu tree structure for a module',
    description:
      'Updates menu order and parent-child relationships based on the provided tree structure.',
  })
  @ApiBody({
    type: UpdateMenuTreeDto,
    examples: {
      'default-example': {
        summary:
          'Example payload for updating a menu tree',
        value: {
          moduleId: 1,
          menuTree: [
            {
              id: 12,
              children: [
                {
                  id: 15,
                  children: [],
                },
                {
                  id: 16,
                  children: [],
                },
              ],
            },
            {
              id: 23,
              children: [],
            },
          ],
        },
      },
    },
  })
  async updateMenuTree(
    @Body() updateMenuTreeDto: UpdateMenuTreeDto,
  ): Promise<{
    message: string;
    updated: number;
  }> {
    return this.menuService.updateMenuTree(
      updateMenuTreeDto,
    );
  }

  @Get(':id')
  @Permissions('view_menu')
  @ApiOperation({ summary: 'Get menu by ID' })
  @ApiParam({
    name: 'id',
    description: 'Menu ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu not found',
  })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update_menu')
  @ApiOperation({ summary: 'Update menu' })
  @ApiParam({
    name: 'id',
    description: 'Menu ID',
  })
  @ApiBody({ type: UpdateMenuDto })
  @ApiResponse({
    status: 200,
    description: 'Menu updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Menu URL already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(
      +id,
      updateMenuDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_menu')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete menu' })
  @ApiParam({
    name: 'id',
    description: 'Menu ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete menu: child menus exist',
  })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }

  @Post(':menuId/permissions')
  @Permissions('assign_menu_permissions')
  @ApiOperation({
    summary: 'Assign permissions to menu',
  })
  @ApiParam({
    name: 'menuId',
    description: 'Menu ID',
  })
  @ApiBody({
    description: 'Permission IDs to assign',
    schema: {
      type: 'object',
      properties: {
        permissionIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Permissions assigned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu not found',
  })
  async assignPermissions(
    @Param('menuId') menuId: string,
    @Body() body: { permissionIds: number[] },
  ) {
    return this.menuService.assignPermissions(
      +menuId,
      body.permissionIds,
    );
  }
}
