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

  @Get(':uuid') findOne(
    @Param('uuid') uuid: string,
  ) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid') update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProcurementItemEntryDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid') remove(
    @Param('uuid') uuid: string,
  ) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid') uuid: string,
  ) {
    return this.service.restore(uuid);
  }
}
