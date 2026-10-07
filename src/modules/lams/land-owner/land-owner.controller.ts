import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { LandOwnerService } from './land-owner.service';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';
import { UpdateLandOwnerDto } from './dto/update-land-owner.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('LAMS - Land Owners')
@Controller('lams/land-owners')
export class LandOwnerController {
  constructor(private readonly service: LandOwnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new land owner/broker' })
  async create(@Body() createDto: CreateLandOwnerDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all land owners/brokers' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a land owner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the land owner' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a land owner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the land owner' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateLandOwnerDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a land owner by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the land owner' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
