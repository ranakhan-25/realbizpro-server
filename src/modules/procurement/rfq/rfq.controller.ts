import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { QueryRfqDto } from './dto/query-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { RfqService } from './rfq.service';

@ApiTags('Procurement | Request for Quotation (RFQ)')
@ApiBearerAuth()
@Controller('procurement/rfq')
export class RfqController {
  constructor(private readonly service: RfqService) {}
  @Post() @ApiOperation({ summary: 'Create RFQ with related item lines' }) create(@Body() dto: CreateRfqDto) { return this.service.create(dto); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get all RFQ form dropdown data' }) dropdowns(@Query('project_id') projectId?: string, @Query('category_id') categoryId?: string) { return this.service.dropdowns(projectId, categoryId); }
  @Get() @ApiOperation({ summary: 'List and filter RFQs' }) findAll(@Query() query: QueryRfqDto) { return this.service.findAll(query); }
  @Get(':uuid') findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') update(@Param('uuid') uuid: string, @Body() dto: UpdateRfqDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
