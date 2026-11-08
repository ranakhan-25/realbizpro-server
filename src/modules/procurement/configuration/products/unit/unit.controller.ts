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
import { CreateProcurementUnitDto } from './dto/create-unit.dto';
import { QueryProcurementUnitDto } from './dto/query-unit.dto';
import { UpdateProcurementUnitDto } from './dto/update-unit.dto';
import { ProcurementUnitService } from './unit.service';

@ApiTags('Procurement | configuration | Unit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/unit')
export class ProcurementUnitController {
  constructor(
    private readonly unitService: ProcurementUnitService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a procurement unit' })
  @Permissions('create_procurement_unit')
  create(@Body() dto: CreateProcurementUnitDto) {
    return this.unitService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get procurement units (paginated)' })
  @Permissions('view_procurement_unit')
  findAll(@Query() query: QueryProcurementUnitDto) {
    return this.unitService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get procurement unit by UUID' })
  @ApiParam({ name: 'uuid', description: 'Unit UUID' })
  findOne(@Param('uuid') uuid: string) {
    return this.unitService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update procurement unit' })
  @Permissions('update_procurement_unit')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementUnitDto,
  ) {
    return this.unitService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete procurement unit' })
  @Permissions('delete_procurement_unit')
  remove(@Param('uuid') uuid: string) {
    return this.unitService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({ summary: 'Restore procurement unit' })
  @Permissions('update_procurement_unit')
  restore(@Param('uuid') uuid: string) {
    return this.unitService.restore(uuid);
  }
}
