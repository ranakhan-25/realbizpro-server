import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemEntryService } from './item_entry.service';
import { CreateItemEntryDto } from './dto/create-item_entry.dto';
import { QueryItemEntryDto } from './dto/query-item_entry.dto';
import { UpdateItemEntryDto } from './dto/update-item_entry.dto';
import { ApiTags } from '@nestjs/swagger';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemEntryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemEntryDto: UpdateItemEntryDto) {
    return this.itemEntryService.update(id, updateItemEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemEntryService.remove(id);
  }
}
