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
  Req,
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
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import {
  AssignMultiplePermissionsDto,
  CreateRoleDto,
  CreateRoleWithPermissionsDto,
} from './dto/create.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { RolesService } from './roles.service';

@ApiTags('System | Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Post()
  @Permissions('create_role')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Role already exists',
  })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });
  }

  @Post('with-permissions')
  @Permissions('create_role')
  @ApiOperation({
    summary:
      'Create a new role and assign permissions in one transaction',
    description:
      'Creates a role and optionally assigns permissions. Permissions can be from any module.',
  })
  @ApiBody({
    type: CreateRoleWithPermissionsDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - validation failed or invalid permissions',
  })
  @ApiResponse({
    status: 409,
    description:
      'Role with this name already exists',
  })
  async createWithPermissions(
    @Body()
    createRoleWithPermissionsDto: CreateRoleWithPermissionsDto,
  ) {
    return this.rolesService.createRoleWithPermissions(
      {
        name: createRoleWithPermissionsDto.name,
        description:
          createRoleWithPermissionsDto.description,
      },
      createRoleWithPermissionsDto.permissionIds ||
        [],
    );
  }

  @Get()
  @Permissions('view_roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
  })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get('dropdown')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get roles dropdown list',
    description:
      'Returns a simplified list of roles for dropdown/select components filtered by caller authority level',
  })
  @ApiResponse({
    status: 200,
    description:
      'Roles dropdown retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          roleLevel: { type: 'number' },
        },
      },
    },
  })
  async getDropdown(@Req() req: any) {
    return this.rolesService.getDropdown(req.user);
  }

  @Post(':roleId/permissions/bulk')
  @Permissions('assign_permission')
  @ApiOperation({
    summary:
      'Assign multiple permissions to role',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
  })
  @ApiBody({
    description: 'Permission IDs to assign',
    type: AssignMultiplePermissionsDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Permissions assigned successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        assignedCount: { type: 'number' },
        totalRequested: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async assignMultiplePermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignMultiplePermissionsDto,
  ) {
    const result =
      await this.rolesService.assignMultiplePermissions(
        parseInt(roleId),
        dto.permissionIds,
        dto.moduleId,
        dto.name,
        dto.description,
        true,
      );

    return {
      message: result.message,
      assignedCount: result.assignedCount,
      totalRequested: dto.permissionIds.length,
    };
  }

  @Get(':id')
  @Permissions('view_role')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update_role')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(
      id,
      updateRoleDto,
    );
  }

  @Delete(':id')
  @Permissions('delete_role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<any> {
    return this.rolesService.remove(id);
  }

  @Post(':roleId/permissions/:permissionId')
  @Permissions('assign_permission')
  @ApiOperation({
    summary: 'Assign permission to role',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
  })
  @ApiResponse({
    status: 201,
    description:
      'Permission assigned successfully',
  })
  async assignPermission(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ) {
    return this.rolesService.assignPermission(
      roleId,
      permissionId,
    );
  }

  @Delete(':roleId/permissions/:permissionId')
  @Permissions('remove_permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove permission from role',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
  })
  @ApiResponse({
    status: 204,
    description:
      'Permission removed successfully',
  })
  async removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<void> {
    return this.rolesService.removePermission(
      roleId,
      permissionId,
    );
  }

  @Get(':id/permissions')
  @Permissions('view_role_permissions')
  @ApiOperation({
    summary: 'Get role permissions',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
  })
  @ApiQuery({
    name: 'moduleId',
    description:
      'Module ID to filter permissions',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Role permissions retrieved successfully',
  })
  async getRolePermissions(
    @Param('id') id: string,
    @Query('moduleId') moduleId?: string,
  ) {
    console.log({
      moduleId,
    });

    let moduleIdNumber: number | undefined =
      undefined;
    if (moduleId) {
      moduleIdNumber = +moduleId;
    }
    const permissions =
      await this.rolesService.getRolePermissions(
        id,
        moduleIdNumber,
      );
    return permissions;
  }
}
