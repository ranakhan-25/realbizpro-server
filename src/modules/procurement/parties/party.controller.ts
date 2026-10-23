import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePartyDto, PartyQueryDto, UpdatePartyDto } from './dto/party.dto';
import { PartyService } from './party.service';

@ApiTags('Procurement | Parties')
@ApiBearerAuth()
@Controller('parties')
export class PartyController {
  constructor(private readonly service: PartyService) {}

  @Post() @ApiOperation({ summary: 'Create party with attached documents' }) create(@Body() dto: CreatePartyDto) { return this.service.create(dto); }
  @Get() @ApiOperation({ summary: 'List parties with search and filters' }) findAll(@Query() query: PartyQueryDto) { return this.service.findAll(query); }
  @Get('dropdowns') @ApiOperation({ summary: 'Get party form dropdown options' }) dropdowns() { return this.service.dropdowns(); }
  @Get(':uuid') @ApiOperation({ summary: 'Get party details and documents' }) findOne(@Param('uuid') uuid: string) { return this.service.findOne(uuid); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update party and documents' }) update(@Param('uuid') uuid: string, @Body() dto: UpdatePartyDto) { return this.service.update(uuid, dto); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete party' }) remove(@Param('uuid') uuid: string) { return this.service.remove(uuid); }
  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore soft-deleted party' }) restore(@Param('uuid') uuid: string) { return this.service.restore(uuid); }
}
