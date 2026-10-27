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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';

@ApiTags('Project | Billing | Item')
@ApiBearerAuth()
@Controller('item')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @Permissions('create_item')
  @ApiOperation({ summary: 'Create a new item' })
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  @Get()
  @Permissions('view_items')
  @ApiOperation({
    summary: 'Get all items (paginated)',
  })
  findAll(@Query() query: QueryItemDto) {
    return this.itemService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_item')
  @ApiOperation({ summary: 'Get item by UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Item UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.itemService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_item')
  @ApiOperation({
    summary: 'Update item by UUID',
  })
  @ApiParam({ name: 'uuid' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_item')
  @ApiOperation({
    summary: 'Delete item by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(@Param('uuid') uuid: string) {
    return this.itemService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_item')
  @ApiOperation({
    summary: 'Restore deleted item',
  })
  @ApiParam({ name: 'uuid' })
  restore(@Param('uuid') uuid: string) {
    return this.itemService.restore(uuid);
  }
}
