import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { QueryRequirementTypeDto } from './dto/query-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';
import { RequirementTypeService } from './requirement-type.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Requirement Type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/requirement-types')
export class RequirementTypeController {
  constructor(private readonly service: RequirementTypeService) {}

  @Post()
  @Permissions('create_crm_requirement_type')
  @ApiOperation({ summary: 'Create a CRM requirement type' })
  create(
    @Body() dto: CreateRequirementTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_requirement_type')
  @ApiOperation({ summary: 'List requirement types with search and pagination' })
  findAll(
    @Query() query: QueryRequirementTypeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_requirement_type')
  @ApiOperation({ summary: 'Get requirement types for CRM form dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_requirement_type')
  @ApiOperation({ summary: 'Get requirement type by UUID, including related lead requirements' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_requirement_type')
  @ApiOperation({ summary: 'Update a requirement type by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateRequirementTypeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_requirement_type')
  @ApiOperation({ summary: 'Soft-delete a requirement type by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_requirement_type')
  @ApiOperation({ summary: 'Restore a soft-deleted requirement type by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
