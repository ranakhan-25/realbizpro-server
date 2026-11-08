import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { QueryVisitStatusDto } from './dto/query-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { VisitStatusService } from './visit-status.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Visit Status')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/visit-statuses')
export class VisitStatusController {
  constructor(private readonly service: VisitStatusService) {}

  @Post()
  @Permissions('create_crm_visit_status')
  @ApiOperation({ summary: 'Create a CRM visit status' })
  create(
    @Body() dto: CreateVisitStatusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_visit_status')
  @ApiOperation({ summary: 'List visit statuses with search and pagination' })
  findAll(
    @Query() query: QueryVisitStatusDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_visit_status')
  @ApiOperation({ summary: 'Get visit statuses for CRM activity dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_visit_status')
  @ApiOperation({ summary: 'Get visit status by UUID with related activities' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_visit_status')
  @ApiOperation({ summary: 'Update visit status by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateVisitStatusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_visit_status')
  @ApiOperation({ summary: 'Soft-delete visit status by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_visit_status')
  @ApiOperation({ summary: 'Restore soft-deleted visit status by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
