/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZkTecoDeviceService } from './zkteco-device.service';
import { CreateZkTecoDeviceDto } from './dto/create-zkteco-device.dto';
import { QueryZkTecoDeviceDto } from './dto/query-zkteco-device.dto';
import { UpdateZkTecoDeviceDto } from './dto/update-zkteco-device.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Configuration | ZkTeco Device')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('zkteco-device')
export class ZkTecoDeviceController {
  constructor(private readonly zkTecoDeviceService: ZkTecoDeviceService) {}

  @Post()
  @Permissions('create_zkteco_device')
  @ApiOperation({ summary: 'Create zkteco device' })
  create(
    @Body() dto: CreateZkTecoDeviceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_zkteco_device')
  @ApiOperation({ summary: 'Get all zkteco devices (paginated)' })
  findAll(
    @Query() query: QueryZkTecoDeviceDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_zkteco_device')
  @ApiOperation({ summary: 'Get zkteco device by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_zkteco_device')
  @ApiOperation({ summary: 'Update zkteco device' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateZkTecoDeviceDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_zkteco_device')
  @ApiOperation({ summary: 'Delete zkteco device' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_zkteco_device')
  @ApiOperation({ summary: 'Restore soft-deleted zkteco device' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.zkTecoDeviceService.restore(uuid, userId, currentUser);
  }
}
