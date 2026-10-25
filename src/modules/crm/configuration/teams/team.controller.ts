import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@ApiTags('CRM | Configuration | Teams')
@ApiBearerAuth()
@Controller('crm/configuration/teams')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Post() @ApiOperation({ summary: 'Create a CRM team with leader and members' })
  create(@Body() dto: CreateTeamDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List CRM teams with search and pagination' })
  findAll(@Query() query: QueryTeamDto) { return this.service.findAll(query); }

  @Get('dropdown') @ApiOperation({ summary: 'Get active CRM teams for dropdowns' })
  dropdown() { return this.service.dropdown(); }

  @Get('dropdown/users') @ApiOperation({ summary: 'Get active users for team leader and member dropdowns' })
  userDropdown() { return this.service.userDropdown(); }

  @Get(':uuid') @ApiOperation({ summary: 'Get CRM team details by UUID with leader and members' })
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) { return this.service.findOne(uuid); }

  @Patch(':uuid') @ApiOperation({ summary: 'Update CRM team details by UUID, leader, or members' })
  update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() dto: UpdateTeamDto) { return this.service.update(uuid, dto); }

  @Delete(':uuid') @ApiOperation({ summary: 'Soft delete a CRM team by UUID' })
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) { return this.service.remove(uuid); }

  @Patch(':uuid/restore') @ApiOperation({ summary: 'Restore a soft-deleted CRM team by UUID' })
  restore(@Param('uuid', new ParseUUIDPipe()) uuid: string) { return this.service.restore(uuid); }
}
