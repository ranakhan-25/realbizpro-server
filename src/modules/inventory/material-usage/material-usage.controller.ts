import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MaterialUsageService } from './material-usage.service';
import { CreateInvMaterialUsageDto } from './dto/create-inv-material-usage.dto';
import { UpdateInvMaterialUsageDto } from './dto/update-inv-material-usage.dto';
import { QueryInvMaterialUsageDto } from './dto/query-inv-material-usage.dto';

@ApiTags('Inventory - Material Usage')
@Controller('inventory/material-usage')
export class MaterialUsageController {
  constructor(private readonly usageService: MaterialUsageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material usage (deducts stock)' })
  create(@Body() createDto: CreateInvMaterialUsageDto) {
    return this.usageService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all material usages' })
  findAll(@Query() query: QueryInvMaterialUsageDto) {
    return this.usageService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single material usage by id' })
  findOne(@Param('id') id: string) {
    return this.usageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a material usage' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvMaterialUsageDto) {
    return this.usageService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a material usage' })
  remove(@Param('id') id: string) {
    return this.usageService.remove(id);
  }
}
