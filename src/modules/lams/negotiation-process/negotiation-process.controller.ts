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

  @Get(':id')
  @ApiOperation({ summary: 'Get a negotiation process record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the negotiation process' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a negotiation process record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the negotiation process' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateNegotiationProcessDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a negotiation process record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the negotiation process' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
