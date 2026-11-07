import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVisitPlaceDto } from './dto/create-visit-place.dto';
import { QueryVisitPlaceDto } from './dto/query-visit-place.dto';
import { UpdateVisitPlaceDto } from './dto/update-visit-place.dto';
import { VisitPlaceService } from './visit-place.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Visit Places')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/visit-places')
export class VisitPlaceController {
  constructor(private readonly service: VisitPlaceService) {}

  @Post()
  @Permissions('create_crm_visit_place')
  @ApiOperation({ summary: 'Create a CRM visit place' })
  create(
    @Body() dto: CreateVisitPlaceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_visit_place')
  @ApiOperation({ summary: 'List visit places with search and pagination' })
  findAll(
    @Query() query: QueryVisitPlaceDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_visit_place')
  @ApiOperation({ summary: 'Get visit places for CRM activity dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_visit_place')
  @ApiOperation({ summary: 'Get a visit place by UUID with related activities' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_visit_place')
  @ApiOperation({ summary: 'Update a visit place by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateVisitPlaceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_visit_place')
  @ApiOperation({ summary: 'Soft-delete a visit place by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_visit_place')
  @ApiOperation({ summary: 'Restore a soft-deleted visit place by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
