import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateInvSupplierDto } from './dto/create-inv-supplier.dto';
import { UpdateInvSupplierDto } from './dto/update-inv-supplier.dto';
import { QueryInvSupplierDto } from './dto/query-inv-supplier.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Inventory - Supplier Accounts')
@ApiBearerAuth()
@Controller('inventory/suppliers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Permissions('inventory_contracts_supplier_accounts.create')
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'The supplier has been successfully created.' })
  create(@Body() createDto: CreateInvSupplierDto) {
    return this.supplierService.create(createDto);
  }

  @Get()
  @Permissions('inventory_contracts_supplier_accounts.read')
  @ApiOperation({ summary: 'Get all suppliers with pagination and search' })
  findAll(@Query() query: QueryInvSupplierDto) {
    return this.supplierService.findAll(query);
  }

  @Get(':id')
  @Permissions('inventory_contracts_supplier_accounts.read')
  @ApiOperation({ summary: 'Get a supplier by UUID' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @Permissions('inventory_contracts_supplier_accounts.update')
  @ApiOperation({ summary: 'Update a supplier' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInvSupplierDto) {
    return this.supplierService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('inventory_contracts_supplier_accounts.delete')
  @ApiOperation({ summary: 'Delete a supplier' })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
