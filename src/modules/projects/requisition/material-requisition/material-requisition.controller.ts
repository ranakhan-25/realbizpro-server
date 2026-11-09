import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, ParseUUIDPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MaterialRequisitionService } from './material-requisition.service';
import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';
import { QueryMaterialRequisitionDto } from './dto/query-material-requisition.dto';

@ApiTags('Project | Requisition | Material Requisition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('material-requisition')
export class MaterialRequisitionController {
  constructor(
    private readonly requisitionService: MaterialRequisitionService,
  ) {}

  @Post()
  @Permissions('create_projects_material_requisition')
  create(
    @Body() dto: CreateMaterialRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.requisitionService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_material_requisition')
  findAll(
    @Query() query: QueryMaterialRequisitionDto, @CurrentUser() currentUser: any
  ) {
    return this.requisitionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_material_requisition')
  findOne(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.requisitionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_material_requisition')
  update(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @Body() dto: UpdateMaterialRequisitionDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.requisitionService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_material_requisition')
  remove(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
    @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.requisitionService.remove(uuid, userId, currentUser);
  }
}
