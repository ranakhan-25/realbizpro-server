import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Follow Ups')
@ApiBearerAuth()
@Controller('lams/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FollowUpController {
  constructor(private readonly service: FollowUpService) {}

  @Post()
  @Permissions('lams_follow_up.create')
  @ApiOperation({ summary: 'Create a new follow-up record' })
  async create(@Body() createDto: CreateFollowUpDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_follow_up.read')
  @ApiOperation({ summary: 'Get all follow-up records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @Permissions('lams_follow_up.read')
  @ApiOperation({ summary: 'Get a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_follow_up.update')
  @ApiOperation({ summary: 'Update a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateFollowUpDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_follow_up.delete')
  @ApiOperation({ summary: 'Delete a follow-up record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the follow-up record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}

