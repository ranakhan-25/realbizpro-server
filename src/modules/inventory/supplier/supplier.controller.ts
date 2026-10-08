import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateInvSupplierDto } from './dto/create-inv-supplier.dto';
import { UpdateInvSupplierDto } from './dto/update-inv-supplier.dto';
import { QueryInvSupplierDto } from './dto/query-inv-supplier.dto';

@ApiTags('Inventory - Supplier Accounts')
@Controller('inventory/suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'The supplier has been successfully created.' })
  create(@Body() createDto: CreateInvSupplierDto) {
    return this.supplierService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers with pagination and search' })
  findAll(@Query() query: QueryInvSupplierDto) {
    return this.supplierService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by UUID' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvSupplierDto) {
    return this.supplierService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
