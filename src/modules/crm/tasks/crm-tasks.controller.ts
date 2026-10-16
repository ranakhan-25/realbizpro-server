import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrmTasksService } from './crm-tasks.service';
import { CreateCrmTaskDto, UpdateCrmTaskDto } from './dto/create-crm-task.dto';

@ApiTags('CRM - Internal Tasks & Delegations')
@Controller('crm/tasks')
export class CrmTasksController {
  constructor(private readonly service: CrmTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create an internal task with assignees' })
  @ApiBody({ type: CreateCrmTaskDto })
  async create(@Body() createDto: CreateCrmTaskDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all internal tasks' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get internal task details with assignees' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update an internal task' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrmTaskDto })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateCrmTaskDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete an internal task' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
