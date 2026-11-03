import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ItemEntryService } from './item_entry.service';
import { CreateItemEntryDto } from './dto/create-item_entry.dto';
import { QueryItemEntryDto } from './dto/query-item_entry.dto';
import { UpdateItemEntryDto } from './dto/update-item_entry.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
@ApiTags('Accounts | assets| item_entry')
@Controller('item-entry')
export class ItemEntryController {
  constructor(private readonly itemEntryService: ItemEntryService) {}

  @Post()
  create(@Body() createItemEntryDto: CreateItemEntryDto) {
    return this.itemEntryService.create(createItemEntryDto);
  }

  @Get()
  findAll(@Query() query: QueryItemEntryDto) {
    return this.itemEntryService.findAll(query);
  }

  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.itemEntryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateItemEntryDto: UpdateItemEntryDto) {
    return this.itemEntryService.update(uuid, updateItemEntryDto);
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.itemEntryService.remove(uuid);
  }
}
