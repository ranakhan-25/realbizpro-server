import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';
import { CustomPermissionsService } from './custom-permissions.service';
import { CreateCustomPermissionDto } from './dto/create-custom-permission.dto';
import { QueryCustomPermissionDto } from './dto/query-custom-permission.dto';
import {
  BulkSetUserCustomPermissionOverridesDto,
  SetUserCustomPermissionOverrideDto,
} from './dto/user-permission-override.dto';

@ApiTags('System | Custom Permissions')
@Controller('custom-permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomPermissionsController {
  constructor(
    private readonly customPermissionsService: CustomPermissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create custom permission' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(@Body() dto: CreateCustomPermissionDto) {
    return this.customPermissionsService.create(dto);
  }

  @Get('user-overrides-summary')
  @ApiOperation({ summary: 'Get summary of users with active custom permission overrides' })
  async getOverridesSummary() {
    return this.customPermissionsService.getActiveUserOverrideSummaries();
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user custom permission overrides and status' })
  async getUserOverrides(@Param('userId') userId: string) {
    return this.customPermissionsService.getUserOverrides(userId);
  }

  @Post('users/:userId/override')
  @ApiOperation({ summary: 'Set or update user custom permission override (DENY or ALLOW)' })
  async setUserOverride(
    @Param('userId') userId: string,
    @Body() dto: SetUserCustomPermissionOverrideDto,
  ) {
    return this.customPermissionsService.setUserOverride(userId, dto);
  }

  @Post('users/:userId/bulk')
  @ApiOperation({ summary: 'Bulk set user custom permission overrides' })
  async bulkSetUserOverrides(
    @Param('userId') userId: string,
    @Body() dto: BulkSetUserCustomPermissionOverridesDto,
  ) {
    return this.customPermissionsService.bulkSetUserOverrides(userId, dto);
  }

  @Delete('users/:userId/override/:customPermissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove user custom permission override (revert to role inheritance)' })
  async removeUserOverride(
    @Param('userId') userId: string,
    @Param('customPermissionId') customPermissionId: string,
  ) {
    return this.customPermissionsService.removeUserOverride(
      userId,
      customPermissionId,
    );
  }

  @Post('check-access')
  @ApiOperation({ summary: 'Check if user has access to a custom permission key' })
  async checkAccess(
    @Body() body: { userId: string | number; permissionKey: string },
  ) {
    return this.customPermissionsService.checkUserPermissionAccess(
      body.userId,
      body.permissionKey,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all custom permissions' })
  async findAll(@Query() query: QueryCustomPermissionDto) {
    const [data, total] =
      await this.customPermissionsService.findAndCount(query);
    return PaginateHelper.response(data, total, {
      limit: query.limit ?? 50,
      page: query.page ?? 1,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom permission by ID' })
  async findOne(@Param('id') id: string) {
    return this.customPermissionsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete custom permission' })
  async remove(@Param('id') id: string) {
    return this.customPermissionsService.remove(id);
  }
}
