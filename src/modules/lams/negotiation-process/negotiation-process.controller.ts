import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { NegotiationProcessService } from './negotiation-process.service';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';
import { UpdateNegotiationProcessDto } from './dto/update-negotiation-process.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('LAMS - Negotiation Process')
@Controller('lams/negotiation-processes')
export class NegotiationProcessController {
  constructor(private readonly service: NegotiationProcessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new negotiation process record' })
  async create(@Body() createDto: CreateNegotiationProcessDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all negotiation process records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a negotiation process record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a negotiation process record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateNegotiationProcessDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a negotiation process record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the negotiation process' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
