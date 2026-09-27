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
import { UpdatePermissionDto } from './dto/update.dto';

import { Permissions } from '../../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';
import { CreatePermissionDto } from './dto/create.dto';
import { QueryPermissionDto } from './dto/filterList.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('System | Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
  ) {}

  @Post()
  @Permissions('create_permission')
  @ApiOperation({
    summary: 'Create a new permission',
  })
  @ApiResponse({
    status: 201,
    description:
      'Permission created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Permission already exists',
  })
  async create(
    @Body()
    createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionsService.create(
      createPermissionDto,
    );
  }

  @Post('bulk')
  @Permissions('create_permission')
  @ApiOperation({
    summary: 'Create multiple permissions',
  })
  @ApiResponse({
    status: 201,
    description:
      'Permissions created successfully',
  })
  @ApiBody({
    type: [CreatePermissionDto],
  })
  async createMany(
    @Body()
    createPermissionsDto: CreatePermissionDto[],
  ) {
    return this.permissionsService.createMany(
      createPermissionsDto,
    );
  }

  @Get()
  @Permissions('view_permissions')
  @ApiOperation({
    summary: 'Get all permissions',
  })
  @ApiResponse({
    status: 200,
    description:
      'Permissions retrieved successfully',
  })
  async findAll(
    @Query() params: QueryPermissionDto,
  ) {
    const [permissions, total] =
      await this.permissionsService.findAndCount(
        params,
      );
    return PaginateHelper.response(
      permissions,
      total,
      {
        limit: params.limit ?? 20,
        page: params.page ?? 1,
      },
    );
  }

  @Get(':id')
  @Permissions('view_permission')
  @ApiOperation({
    summary: 'Get permission by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Permission retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update_permission')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Permission updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  @ApiBody({ type: () => UpdatePermissionDto })
  async update(
    @Param('id') id: string,
    @Body()
    updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(
      id,
      updatePermissionDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete permission' })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
  })
  @ApiResponse({
    status: 204,
    description:
      'Permission deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
