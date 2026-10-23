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
import {
  CreateLaborTypeDto,
  QueryLaborTypeDto,
  UpdateLaborTypeDto,
} from './dto/labor-type.dto';
import { ProcurementLaborTypeService } from './labor-type.service';

@ApiTags('Procurement | Labor Types')
@ApiBearerAuth()
@Controller('procurement/labor-types')
export class ProcurementLaborTypeController {
  constructor(
    private readonly service: ProcurementLaborTypeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a labor type',
  })
  create(@Body() dto: CreateLaborTypeDto) {
    return this.service.create(dto);
  }
  @Get()
  @ApiOperation({
    summary:
      'List labor types with quick search and status filter',
  })
  findAll(@Query() query: QueryLaborTypeDto) {
    return this.service.findAll(query);
  }
  @Get('dropdowns')
  @ApiOperation({
    summary:
      'Get active labor types for dropdowns',
  })
  dropdowns() {
    return this.service.dropdowns();
  }
  @Get(':uuid')
  @ApiOperation({
    summary: 'Get labor type details',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update labor type' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateLaborTypeDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete labor type',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted labor type',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
