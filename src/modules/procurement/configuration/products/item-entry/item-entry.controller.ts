import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcurementItemEntryDto } from './dto/create-item-entry.dto';
import { QueryProcurementItemEntryDto } from './dto/query-item-entry.dto';
import { UpdateProcurementItemEntryDto } from './dto/update-item-entry.dto';
import { ProcurementItemEntryService } from './item-entry.service';

@ApiTags(
  'Procurement | Configuration | Item Entry',
)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('procurement/item-entry')
export class ProcurementItemEntryController {
  constructor(
    private readonly service: ProcurementItemEntryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create procurement item entry',
  })
  create(
    @Body() dto: CreateProcurementItemEntryDto,
  ) {
    return this.service.create(dto);
  }

  @Get('dropdowns')
  @ApiOperation({
    summary:
      'Get category, sub-category, brand and unit dropdown options',
  })
  dropdowns(
    @Query('category_id') categoryId?: string,
  ) {
    return this.service.dropdowns(categoryId);
  }

  @Get()
  @ApiOperation({
    summary:
      'List procurement items with related dropdown names',
  })
  findAll(
    @Query() query: QueryProcurementItemEntryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':uuid') @Permissions('view_procurement_item_entry')
  findOne(
    @Param('uuid') uuid: string,
  ) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid') @Permissions('update_procurement_item_entry')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementItemEntryDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid') @Permissions('delete_procurement_item_entry')
  remove(
    @Param('uuid') uuid: string,
  ) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore') @Permissions('update_procurement_item_entry')
  restore(
    @Param('uuid') uuid: string,
  ) {
    return this.service.restore(uuid);
  }
}
