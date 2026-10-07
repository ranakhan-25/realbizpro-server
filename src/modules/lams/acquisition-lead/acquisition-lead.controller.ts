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

  @Get(':uuid')
  @ApiOperation({ summary: 'Get an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateAcquisitionLeadDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete an acquisition lead by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the acquisition lead' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
