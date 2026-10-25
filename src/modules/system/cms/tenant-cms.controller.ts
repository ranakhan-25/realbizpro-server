import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantCmsService } from './tenant-cms.service';
import {
  UpdateTenantSiteDto,
  CreateTenantMenuDto,
  CreateTenantMenuItemDto,
  UpdateTenantMenuItemDto,
  CreateTenantPageDto,
  UpdateTenantPageDto,
  CreateTenantPageBlockDto,
  UpdateTenantPageBlockDto,
} from './dto/tenant-cms.dto';

@ApiTags('Tenant | CMS & Navigation')
@Controller('system/cms')
export class TenantCmsController {
  constructor(private readonly cmsService: TenantCmsService) {}

  private resolveOrgId(req: any, queryOrgId?: number): number {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }
    // If super admin and queryOrgId provided, allow switching tenant view
    if (user.isSuperAdmin && queryOrgId) {
      return Number(queryOrgId);
    }
    // Default to the user's bound orgId
    if (user.orgId) {
      return Number(user.orgId);
    }
    // Fallback for platform root
    return 1;
  }

  // --- SITE SETTINGS ---
  @Get('site')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current tenant website settings and theme palette' })
  async getSite(@Req() req: any, @Query('orgId') queryOrgId?: number) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.getSite(orgId);
  }

  @Patch('site')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant website settings and theme palette' })
  async updateSite(
    @Req() req: any,
    @Body() dto: UpdateTenantSiteDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.updateSite(orgId, dto);
  }

  // --- MENUS ---
  @Get('menus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tenant menus with hierarchical tree' })
  async getMenus(@Req() req: any, @Query('orgId') queryOrgId?: number) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.getMenuTree(orgId);
  }

  @Post('menus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu header' })
  async createMenu(
    @Req() req: any,
    @Body() dto: CreateTenantMenuDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.createMenu(orgId, dto);
  }

  @Post('menu-items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a menu item link' })
  async createMenuItem(
    @Req() req: any,
    @Body() dto: CreateTenantMenuItemDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.createMenuItem(orgId, dto);
  }

  @Patch('menu-items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item link' })
  async updateMenuItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTenantMenuItemDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.updateMenuItem(orgId, Number(id), dto);
  }

  @Delete('menu-items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item link' })
  async deleteMenuItem(
    @Req() req: any,
    @Param('id') id: string,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.deleteMenuItem(orgId, Number(id));
  }

  // --- PAGES & BLOCKS ---
  @Get('pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tenant dynamic pages' })
  async getPages(@Req() req: any, @Query('orgId') queryOrgId?: number) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.getPages(orgId);
  }

  @Post('pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new dynamic page' })
  async createPage(
    @Req() req: any,
    @Body() dto: CreateTenantPageDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.createPage(orgId, dto);
  }

  @Patch('pages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a dynamic page' })
  async updatePage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTenantPageDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.updatePage(orgId, Number(id), dto);
  }

  @Post('blocks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a content block to a dynamic page' })
  async addPageBlock(
    @Req() req: any,
    @Body() dto: CreateTenantPageBlockDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.addPageBlock(orgId, dto);
  }

  @Patch('blocks/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page content block' })
  async updatePageBlock(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTenantPageBlockDto,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.updatePageBlock(orgId, Number(id), dto);
  }

  @Delete('blocks/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page content block' })
  async deletePageBlock(
    @Req() req: any,
    @Param('id') id: string,
    @Query('orgId') queryOrgId?: number,
  ) {
    const orgId = this.resolveOrgId(req, queryOrgId);
    return this.cmsService.deletePageBlock(orgId, Number(id));
  }

  // --- PUBLIC PORTAL RESOLUTION ---
  @Get('public/:subdomainOrOrgId')
  @ApiOperation({ summary: 'Public portal data for white-labeled client site' })
  async getPublicSite(@Param('subdomainOrOrgId') subdomainOrOrgId: string) {
    return this.cmsService.resolvePublicSite(subdomainOrOrgId);
  }
}
