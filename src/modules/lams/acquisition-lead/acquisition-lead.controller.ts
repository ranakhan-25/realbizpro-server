import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { AcquisitionLeadService } from './acquisition-lead.service';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';
import { UpdateAcquisitionLeadDto } from './dto/update-acquisition-lead.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('LAMS - Acquisition Leads')
@Controller('lams/acquisition-leads')
export class AcquisitionLeadController {
  constructor(private readonly service: AcquisitionLeadService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new acquisition lead' })
  async create(@Body() createDto: CreateAcquisitionLeadDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all acquisition leads' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an acquisition lead by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the acquisition lead' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an acquisition lead by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the acquisition lead' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAcquisitionLeadDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an acquisition lead by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the acquisition lead' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
