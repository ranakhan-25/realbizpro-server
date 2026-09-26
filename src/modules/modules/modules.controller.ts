import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './modules.service';

@ApiTags('System | Modules')
@Controller('modules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(
    private readonly menuModulesService: ModulesService,
  ) {}

  @Post()
  @Permissions('create_module')
  @ApiOperation({
    summary: 'Create a new menu module',
  })
  @ApiResponse({
    status: 201,
    description:
      'Menu module created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Module name already exists',
  })
  async create(
    @Body() createMenuModuleDto: CreateModuleDto,
  ) {
    return this.menuModulesService.create(
      createMenuModuleDto,
    );
  }

  @Get()
  @Permissions('view_modules')
  @ApiOperation({
    summary: 'Get all menu modules (flat list)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Menu modules retrieved successfully',
  })
  async findAll() {
    return this.menuModulesService.findAll();
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'Get modules dropdown list',
    description:
      'Returns a simplified list of modules for dropdown/select components',
  })
  @ApiResponse({
    status: 200,
    description:
      'Modules dropdown retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getDropdown() {
    return this.menuModulesService.getDropdown();
  }

  @Get(':id')
  @Permissions('view_module')
  @ApiOperation({
    summary:
      'Get menu module by ID (with children)',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu module ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu module found',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu module not found',
  })
  async findOne(@Param('id') id: string) {
    return this.menuModulesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update_module')
  @ApiOperation({ summary: 'Update menu module' })
  @ApiParam({
    name: 'id',
    description: 'Menu module ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Menu module updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu module not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Module name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMenuModuleDto: UpdateModuleDto,
  ) {
    return this.menuModulesService.update(
      +id,
      updateMenuModuleDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_module')
  @ApiOperation({ summary: 'Delete menu module' })
  @ApiParam({
    name: 'id',
    description: 'Menu module ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Menu module deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu module not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete module: menus exist under this module',
  })
  async remove(@Param('id') id: string) {
    return this.menuModulesService.remove(+id);
  }
}
