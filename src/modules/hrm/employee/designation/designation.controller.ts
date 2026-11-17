/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Designation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  @Permissions('create_designation')
  @ApiOperation({ summary: 'Create designation' })
  create(
    @Body() dto: CreateDesignationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_designation')
  @ApiOperation({ summary: 'Get all designations (paginated)' })
  findAll(
    @Query() query: QueryDesignationDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_designation')
  @ApiOperation({ summary: 'Get designations dropdown list' })
  getDropdown(@CurrentUser() currentUser: any) {
    return this.designationService.getDropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_designation')
  @ApiOperation({ summary: 'Get designation by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_designation')
  @ApiOperation({ summary: 'Update designation' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDesignationDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_designation')
  @ApiOperation({ summary: 'Delete designation' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_designation')
  @ApiOperation({ summary: 'Restore soft-deleted designation' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.designationService.restore(uuid, userId, currentUser);
  }
}
