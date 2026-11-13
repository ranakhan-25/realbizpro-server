import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MaterialUsageService } from './material-usage.service';
import { CreateInvMaterialUsageDto } from './dto/create-inv-material-usage.dto';
import { UpdateInvMaterialUsageDto } from './dto/update-inv-material-usage.dto';
import { QueryInvMaterialUsageDto } from './dto/query-inv-material-usage.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Material Usage')
@ApiBearerAuth()
@Controller('inventory/material-usage')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialUsageController {
  constructor(private readonly usageService: MaterialUsageService) {}

  @Post()
  @Permissions('inventory_adjustment_material_usage.create')
  @ApiOperation({ summary: 'Create a new material usage (deducts stock)' })
  create(@Body() createDto: CreateInvMaterialUsageDto) {
    return this.usageService.create(createDto);
  }

  @Get()
  @Permissions('inventory_adjustment_material_usage.read')
  @ApiOperation({ summary: 'Get all material usages' })
  findAll(@Query() query: QueryInvMaterialUsageDto) {
    return this.usageService.findAll(query);
  }

  @Get(':id')
  @Permissions('inventory_adjustment_material_usage.read')
  @ApiOperation({ summary: 'Get a single material usage by id' })
  findOne(@Param('id') id: string) {
    return this.usageService.findOne(id);
  }

  @Patch(':id')
  @Permissions('inventory_adjustment_material_usage.update')
  @ApiOperation({ summary: 'Update a material usage' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvMaterialUsageDto) {
    return this.usageService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_adjustment_material_usage.delete')
  @ApiOperation({ summary: 'Delete a material usage' })
  remove(@Param('id') id: string) {
    return this.usageService.remove(id);
  }
}
