import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ShareUserRole } from '../../database/models/share-user/share-user.model';
import { ShareProjectStatus } from '../../database/models/share-project/share-project.model';
import { ShareUserAuthGuard } from '../share-user/share-user-auth.guard';
import { ShareUserRoleGuard, ShareUserRoles } from '../share-user/share-user-role.guard';
import {
  CreateShareProjectCategoryDto,
  CreateShareProjectDto,
  RejectShareProjectDto,
  UpdateShareProjectCategoryDto,
  UpdateShareProjectDto,
} from './dto/share-project.dto';
import { ShareProjectService } from './share-project.service';

@ApiTags('Share Project')
@Controller('share-project')
export class ShareProjectController {
  constructor(private readonly service: ShareProjectService) {}

  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Post('owner/projects') create(@Req() req: any, @Body() dto: CreateShareProjectDto) {
    return this.service.create(req.user.id, dto);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Put('owner/projects/:uuid') update(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateShareProjectDto) {
    return this.service.update(req.user.id, uuid, dto);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('owner/projects') mine(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10, @Query('status') status?: ShareProjectStatus) {
    return this.service.findMine(req.user.id, Number(page), Number(limit), status);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('owner/projects/:uuid') mineOne(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.findMineOne(req.user.id, uuid);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Post('owner/projects/:uuid/submit') submit(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.submit(req.user.id, uuid, false);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Post('owner/projects/:uuid/resubmit') resubmit(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.submit(req.user.id, uuid, true);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('owner/projects/:uuid/status') status(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.findMineOne(req.user.id, uuid).then((project) => ({ status: project.status, rejectionReason: project.rejectionReason }));
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('owner/projects/:uuid/submissions') submissionHistory(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.submissionHistory(req.user.id, uuid);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('user/dashboard') userDashboard(@Req() req: any) {
    return this.service.userDashboard(req.user.id);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('user/portfolio') userPortfolio(@Req() req: any) {
    return this.service.userPortfolio(req.user.id);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Get('user/notifications') userNotifications(@Req() req: any) {
    return this.service.userNotifications(req.user.id);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard)
  @Post('user/investments/prepare')
  prepareInvestment(@Req() req: any, @Body() dto: { projectUuid: string; quantity: number }) {
    return this.service.prepareInvestment(req.user.id, dto.projectUuid, Number(dto.quantity));
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/investments')
  adminInvestments(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.adminInvestments(Number(page), Number(limit));
  }

  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects') allProjects(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string, @Query('status') status?: ShareProjectStatus) {
    return this.service.adminList(status, Number(page), Number(limit), search);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/pending') pending(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminList(ShareProjectStatus.PENDING, Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/approved') approved(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminList(ShareProjectStatus.APPROVED, Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/rejected') rejected(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminList(ShareProjectStatus.REJECTED, Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/published') published(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminList(ShareProjectStatus.PUBLISHED, Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/unpublished') unpublished(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminList(ShareProjectStatus.UNPUBLISHED, Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/trash') trash(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.adminTrash(Number(page), Number(limit)); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/projects/:uuid') adminDetails(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.adminDetails(uuid);
  }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/projects/:uuid/approve') approve(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.transition(uuid, req.user.id, ShareProjectStatus.APPROVED); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/projects/:uuid/reject') reject(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: RejectShareProjectDto) { return this.service.transition(uuid, req.user.id, ShareProjectStatus.REJECTED, dto.reason); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/projects/:uuid/publish') publish(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.transition(uuid, req.user.id, ShareProjectStatus.PUBLISHED); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/projects/:uuid/unpublish') unpublish(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.transition(uuid, req.user.id, ShareProjectStatus.UNPUBLISHED); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Delete('admin/projects/:uuid') remove(@Req() req: any, @Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.softDelete(uuid, req.user.id); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Patch('admin/projects/:uuid/restore') restore(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.restore(uuid); }

  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Get('admin/categories') allCategories() { return this.service.categoryList(false); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Post('admin/categories') createCategory(@Body() dto: CreateShareProjectCategoryDto) { return this.service.createCategory(dto); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Patch('admin/categories/:uuid') updateCategory(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateShareProjectCategoryDto) { return this.service.updateCategory(uuid, dto); }
  @ApiBearerAuth() @UseGuards(ShareUserAuthGuard, ShareUserRoleGuard) @ShareUserRoles(ShareUserRole.SUPER_ADMIN)
  @Delete('admin/categories/:uuid') deleteCategory(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.deleteCategory(uuid); }

  @Public() @Get('public/projects') publicProjects(@Query('page') page = 1, @Query('limit') limit = 10) { return this.service.publicList(Number(page), Number(limit)); }
  @Public() @Get('public/projects/:uuid') publicProject(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.publicOne(uuid); }
  @Public() @Get('public/categories') publicCategories() { return this.service.categoryList(true); }
}
