import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('LAMS - Follow Ups')
@Controller('lams/follow-ups')
export class FollowUpController {
  constructor(private readonly service: FollowUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new follow-up record' })
  async create(@Body() createDto: CreateFollowUpDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all follow-up records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateFollowUpDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
