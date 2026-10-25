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
import {
  CreateModuleTreeDto,
  FeatureNodeDto,
  FeatureNodeResponseDto,
  ModuleTreeNodeResponseDto,
} from './dto/module-tree.dto';
import { ModulesService } from './modules.service';

@ApiTags('System | Modules')
@Controller('modules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(
    private readonly menuModulesService: ModulesService,
  ) {}

  @Get('tree')
  @ApiOperation({
    summary: 'Get complete module and nested feature tree',
    description: 'Returns all system modules with their child features, display ordering, route paths, and action types.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tree returned successfully',
    type: [ModuleTreeNodeResponseDto],
  })
  async getTree(): Promise<ModuleTreeNodeResponseDto[]> {
    return this.menuModulesService.getTree();
  }

  @Post('tree')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create or update module and nested features tree',
    description: 'Super Admin submits complete module with all nested features created via the "+" button in 1 atomic save.',
  })
  @ApiResponse({
    status: 201,
    description: 'Module and feature tree saved successfully',
    type: ModuleTreeNodeResponseDto,
  })
  async saveTree(
    @Body() dto: CreateModuleTreeDto,
  ): Promise<ModuleTreeNodeResponseDto> {
    return this.menuModulesService.saveTree(dto);
  }

  @Post(':id/features')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add a single nested feature to an existing module',
  })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 201,
    description: 'Feature created',
    type: FeatureNodeResponseDto,
  })
  async addFeature(
    @Param('id') id: string,
    @Body() dto: FeatureNodeDto,
  ): Promise<FeatureNodeResponseDto> {
    return this.menuModulesService.addFeature(Number(id), dto);
  }

  @Delete('features/:featureId')
  @ApiOperation({
    summary: 'Delete a nested feature',
  })
  @ApiParam({ name: 'featureId', description: 'Feature numeric ID' })
  @ApiResponse({
    status: 200,
    description: 'Feature deleted successfully',
  })
  async deleteFeature(@Param('featureId') featureId: string) {
    return this.menuModulesService.deleteFeature(Number(featureId));
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new menu module',
  })
  @ApiResponse({
    status: 201,
    description: 'Menu module created successfully',
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
  @ApiOperation({
    summary: 'Get all menu modules (flat list)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of menu modules',
  })
  async findAll() {
    return this.menuModulesService.findAll();
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'Get modules dropdown list',
  })
  @ApiResponse({
    status: 200,
    description: 'Dropdown list of modules',
  })
  async getDropdown() {
    return this.menuModulesService.getDropdown();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get menu module by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
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
  @ApiOperation({
    summary: 'Update menu module',
  })
  @ApiParam({
    name: 'id',
    type: Number,
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
  @ApiOperation({
    summary: 'Delete menu module',
  })
  @ApiParam({
    name: 'id',
    type: Number,
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
