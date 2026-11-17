import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeadCategoryDto } from './dto/create-lead-category.dto';
import { QueryLeadCategoryDto } from './dto/query-lead-category.dto';
import { UpdateLeadCategoryDto } from './dto/update-lead-category.dto';
import { LeadCategoryService } from './lead-category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Lead Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/lead-categories')
export class LeadCategoryController {
  constructor(private readonly service: LeadCategoryService) {}

  @Post()
  @Permissions('create_crm_lead_category')
  @ApiOperation({ summary: 'Create a lead category' })
  create(
    @Body() dto: CreateLeadCategoryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_lead_category')
  @ApiOperation({ summary: 'List lead categories with search, active filter, and pagination' })
  findAll(
    @Query() query: QueryLeadCategoryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_lead_category')
  @ApiOperation({ summary: 'Get lead category details by UUID' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_lead_category')
  @ApiOperation({ summary: 'Update a lead category by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateLeadCategoryDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_lead_category')
  @ApiOperation({ summary: 'Soft delete a lead category by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_lead_category')
  @ApiOperation({ summary: 'Restore a soft-deleted lead category by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
