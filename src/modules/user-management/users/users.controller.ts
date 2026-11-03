import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, CurrentUserId } from '../../../common/decorators/auth.decorators';
import { Public } from '../../../common/decorators/public.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';
import { AddUserPermissionsDto } from './dto/add-user-permissions.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserPermissionsDto } from './dto/delete-user-permissions.dto';
import { UserFilterDropdownDto } from './dto/filter-dropdown.dto';
import { QueryUserDto } from './dto/filterList.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserFeatureAccessDto } from './dto/user-feature-access.dto';
import { UsersService } from './users.service';

@ApiTags('System | Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Permissions('create_user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    return this.usersService.create(
      createUserDto,
      userId,
      currentUser,
    );
  }

  @Post('convert/employee/:employeeId')
  @Permissions('create_user')
  @ApiOperation({
    summary:
      'Convert employee to user with default password',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description:
      'Employee converted to user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Employee is already linked to another user',
  })
  async convertEmployeeToUser(
    @Param('employeeId', ParseIntPipe)
    employeeId: number,
    @CurrentUserId() userId: number,
  ): Promise<any> {
    return this.usersService.convertEmployeeToUser(
      employeeId,
      userId,
    );
  }

  @Get()
  @Permissions('view_users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(
    @Query() params: QueryUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    const [users, total] =
      await this.usersService.findAndCount(
        params,
        currentUser,
      );
    return PaginateHelper.response(users, total, {
      limit: params.limit ?? 20,
      page: params.page ?? 1,
    });
  }

  @Get('dropdown/list')
  @ApiOperation({
    summary: 'Get user dropdown list',
    description:
      'Returns a simplified list of users for dropdowns with optional employee filters',
  })
  async getUserDropdown(
    @Query() filters: UserFilterDropdownDto,
  ) {
    return this.usersService.getUserDropdown(
      filters,
    );
  }

  @Get('public/mobile-auth-employee-codes')
  @Public()
  @ApiOperation({
    summary:
      'Get mobile-auth enabled employee codes for dropdown',
    description:
      'Returns employee codes only for employees where mobileAuth = 1. Supports partial employeeCode search.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Optional employee code search term',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Maximum number of results to return',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Mobile-auth employee codes retrieved successfully',
  })
  async getMobileAuthEmployeeCodeDropdown(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getMobileAuthEmployeeCodeDropdown(
      search,
      limit ? Number(limit) : undefined,
    );
  }

  @Post('permissions')
  @Permissions('manage_user_permissions')
  @ApiOperation({
    summary: 'Add permissions to user',
    description:
      'Assign multiple permissions to a single user',
  })
  @ApiResponse({
    status: 201,
    description:
      'Permissions assigned successfully',
  })
  async addUserPermissions(
    @Body() body: AddUserPermissionsDto,
  ): Promise<any> {
    return this.usersService.addUserPermissions(
      body.userId,
      body.permissionIds,
      body.moduleId,
    );
  }

  @Delete('permissions')
  @Permissions('manage_user_permissions')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user permissions',
    description:
      'Remove specific permissions from a user',
  })
  @ApiResponse({
    status: 204,
    description:
      'Permissions deleted successfully',
  })
  async deleteUserPermissions(
    @Body() body: DeleteUserPermissionsDto,
  ): Promise<void> {
    await this.usersService.deleteUserPermissions(
      body.userId,
      body.permissionIds,
    );
  }

  @Get(':id/feature-access')
  @Permissions('view_users')
  @ApiOperation({ summary: 'Get user module and feature access entitlements' })
  async getUserFeatureAccess(@Param('id') id: string) {
    return this.usersService.getUserFeatureAccess(id);
  }

  @Put(':id/feature-access')
  @Permissions('manage_users')
  @ApiOperation({ summary: 'Update user module and feature access entitlements' })
  async updateUserFeatureAccess(
    @Param('id') id: string,
    @Body() body: UpdateUserFeatureAccessDto,
  ) {
    return this.usersService.updateUserFeatureAccess(id, body);
  }

  @Get(':uuid')
  @Permissions('view_user')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'uuid',
    description: 'User ID',
  })
  @ApiQuery({
    name: 'includePermissions',
    type: Boolean,
    description:
      'Whether to include user permissions in the response',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(
    @Param('uuid') uuid: string,
    @Query('includePermissions') // Changed from @Param
    includePermissions?: boolean,
  ): Promise<any> {
    console.log({
      includePermissions,
    });

    return this.usersService.findByUuid(
      uuid,
      includePermissions,
    );
  }

  @Patch(':uuid')
  @Permissions('update_user')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'uuid',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.update(
      uuid,
      updateUserDto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_user')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'uuid',
    description: 'User ID',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(
    @Param('uuid') uuid: string,
  ): Promise<void> {
    return this.usersService.remove(uuid);
  }

  @Post(':userId/roles/:roleId')
  @Permissions('assign_role')
  @ApiOperation({
    summary: 'Assign role to user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
  })
  @ApiResponse({
    status: 201,
    description: 'Role assigned successfully',
  })
  async assignRole(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ) {
    return this.usersService.assignRole(
      userId,
      roleId,
    );
  }

  @Delete(':userId/roles/:roleId')
  @Permissions('remove_role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove role from user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Role removed successfully',
  })
  async removeRole(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ): Promise<void> {
    return this.usersService.removeRole(
      userId,
      roleId,
    );
  }
}
