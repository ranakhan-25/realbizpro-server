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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  AdminMenuService,
  AdminMenuItemDto,
  ReorderAdminMenuItemDto,
} from './admin-menu.service';

@ApiTags('System | Admin Menu CMS')
@Controller('system/admin-menus')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminMenuController {
  constructor(private readonly adminMenuService: AdminMenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get dynamic admin dashboard sidebar menus by role' })
  async getMenuTree(@Query('role') role?: string): Promise<AdminMenuItemDto[]> {
    return this.adminMenuService.getMenuTree(role);
  }

  @Post()
  @ApiOperation({ summary: 'Create new admin dashboard menu item' })
  async createMenuItem(@Body() dto: AdminMenuItemDto): Promise<AdminMenuItemDto> {
    return this.adminMenuService.createMenuItem(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin dashboard menu item' })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() dto: Partial<AdminMenuItemDto>,
  ): Promise<AdminMenuItemDto> {
    return this.adminMenuService.updateMenuItem(Number(id), dto);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Batch reorder and reparent admin dashboard menu tree' })
  async reorderTree(
    @Body() body: { items: ReorderAdminMenuItemDto[] },
  ): Promise<{ success: boolean; count: number }> {
    return this.adminMenuService.reorderTree(body.items || []);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin dashboard menu item' })
  async deleteMenuItem(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.adminMenuService.deleteMenuItem(Number(id));
  }
}
