import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcurementBrandDto } from './dto/create-brand.dto';
import { QueryProcurementBrandDto } from './dto/query-brand.dto';
import { UpdateProcurementBrandDto } from './dto/update-brand.dto';
import { ProcurementBrandService } from './brand.service';

@ApiTags('Procurement | configuration | Brand')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/brand')
export class ProcurementBrandController {
  constructor(
    private readonly brandService: ProcurementBrandService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a procurement brand' })
  @Permissions('create_procurement_brand')
  create(@Body() dto: CreateProcurementBrandDto) {
    return this.brandService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get procurement brands (paginated)' })
  @Permissions('view_procurement_brand')
  findAll(@Query() query: QueryProcurementBrandDto) {
    return this.brandService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get procurement brand by UUID' })
  @ApiParam({ name: 'uuid', description: 'Brand UUID' })
  findOne(@Param('uuid') uuid: string) {
    return this.brandService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update procurement brand' })
  @Permissions('update_procurement_brand')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementBrandDto,
  ) {
    return this.brandService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete procurement brand' })
  @Permissions('delete_procurement_brand')
  remove(@Param('uuid') uuid: string) {
    return this.brandService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore procurement brand' })
  @Permissions('update_procurement_brand')
  restore(@Param('uuid') uuid: string) {
    return this.brandService.restore(uuid);
  }
}
