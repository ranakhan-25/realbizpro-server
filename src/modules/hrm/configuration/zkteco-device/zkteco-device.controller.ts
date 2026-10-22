/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ZkTecoDeviceService } from './zkteco-device.service';
import { CreateZkTecoDeviceDto } from './dto/create-zkteco-device.dto';
import { QueryZkTecoDeviceDto } from './dto/query-zkteco-device.dto';
import { UpdateZkTecoDeviceDto } from './dto/update-zkteco-device.dto';

@ApiTags('HRM | Configuration | ZkTeco Device')
@ApiBearerAuth()
@Controller('zkteco-device')
export class ZkTecoDeviceController {
  constructor(
    private readonly zkTecoDeviceService: ZkTecoDeviceService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new ZkTeco device',
  })
  create(
    @Body()
    createZkTecoDeviceDto: CreateZkTecoDeviceDto,
  ) {
    return this.zkTecoDeviceService.create(
      createZkTecoDeviceDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all ZkTeco devices (paginated)',
  })
  findAll(
    @Query()
    query: QueryZkTecoDeviceDto,
  ) {
    return this.zkTecoDeviceService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get ZkTeco device by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.zkTecoDeviceService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update ZkTeco device',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateZkTecoDeviceDto: UpdateZkTecoDeviceDto,
  ) {
    return this.zkTecoDeviceService.update(
      uuid,
      updateZkTecoDeviceDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete ZkTeco device (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.zkTecoDeviceService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted ZkTeco device (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.zkTecoDeviceService.restore(uuid);
  }
}
