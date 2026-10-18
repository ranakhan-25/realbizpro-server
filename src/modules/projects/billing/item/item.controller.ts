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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';

@ApiTags('Project | Billing | Item')
@ApiBearerAuth()
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all items (paginated)',
  })
  findAll(@Query() query: QueryItemDto) {
    return this.itemService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get item by UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Item UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.itemService.findOne(uuid);
  }

  @Patch(':uuid')
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
  @ApiOperation({
    summary: 'Delete item by UUID',
  })
  @ApiParam({ name: 'uuid' })
  remove(@Param('uuid') uuid: string) {
    return this.itemService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted item',
  })
  @ApiParam({ name: 'uuid' })
  restore(@Param('uuid') uuid: string) {
    return this.itemService.restore(uuid);
  }
}
