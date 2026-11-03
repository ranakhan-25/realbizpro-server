import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  AdminMenuService,
  AdminMenuItemDto,
  ReorderAdminMenuItemDto,
} from './admin-menu.service';

@ApiTags('System | Admin Menu CMS')
@Controller('system/admin-menus')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminMenuController {
  constructor(
    private readonly adminMenuService: AdminMenuService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get dynamic admin dashboard sidebar menus by role and optional moduleId',
  })
  async getMenuTree(
    @Query('role') role?: string,
    @Query('moduleId') moduleId?: string,
  ): Promise<AdminMenuItemDto[]> {
    return this.adminMenuService.getMenuTree(
      role,
      moduleId,
    );
  }

  @Post()
  @Roles('super-admin')
  @ApiOperation({
    summary:
      'Create new admin dashboard menu item (Super Admin only)',
  })
  async createMenuItem(
    @Body() dto: AdminMenuItemDto,
  ): Promise<AdminMenuItemDto> {
    return this.adminMenuService.createMenuItem(
      dto,
    );
  }

  @Patch(':id')
  @Roles('super-admin')
  @ApiOperation({
    summary:
      'Update admin dashboard menu item (Super Admin only)',
  })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() dto: Partial<AdminMenuItemDto>,
  ): Promise<AdminMenuItemDto> {
    return this.adminMenuService.updateMenuItem(
      Number(id),
      dto,
    );
  }

  @Put('reorder')
  @Roles('super-admin')
  @ApiOperation({
    summary:
      'Batch reorder and reparent admin dashboard menu tree (Super Admin only)',
  })
  async reorderTree(
    @Body()
    body: {
      items: ReorderAdminMenuItemDto[];
    },
  ): Promise<{
    success: boolean;
    count: number;
  }> {
    return this.adminMenuService.reorderTree(
      body.items || [],
    );
  }

  @Delete(':id')
  @Roles('super-admin')
  @ApiOperation({
    summary:
      'Delete admin dashboard menu item (Super Admin only)',
  })
  async deleteMenuItem(
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.adminMenuService.deleteMenuItem(
      Number(id),
    );
  }
}
