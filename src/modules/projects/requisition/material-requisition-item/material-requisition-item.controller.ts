import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaterialRequisitionItemService } from './material-requisition-item.service';
import { CreateMaterialRequisitionItemDto } from './dto/create-material-requisition-item.dto';
import { UpdateMaterialRequisitionItemDto } from './dto/update-material-requisition-item.dto';
import { QueryMaterialRequisitionItemDto } from './dto/query-material-requisition-item.dto';

@ApiTags('Project | Requisition | Material Requisition Item')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('material-requisition-item')
export class MaterialRequisitionItemController {
  constructor(
    private readonly itemService: MaterialRequisitionItemService,
  ) {}

  @Post()
  @Permissions('create_projects_material_requisition_item')
  create(
    @Body() dto: CreateMaterialRequisitionItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_material_requisition_item')
  findAll(
    @Query()
    query: QueryMaterialRequisitionItemDto, @CurrentUser() currentUser: any
  ) {
    return this.itemService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_material_requisition_item')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.itemService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_material_requisition_item')
  update(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Body() dto: UpdateMaterialRequisitionItemDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_material_requisition_item')
  remove(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.itemService.remove(uuid, userId, currentUser);
  }
}
