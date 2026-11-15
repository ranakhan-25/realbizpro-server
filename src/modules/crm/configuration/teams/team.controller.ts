import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/teams')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Post()
  @Permissions('create_crm_team')
  @ApiOperation({ summary: 'Create a CRM team with leader and members' })
  create(
    @Body() dto: CreateTeamDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_team')
  @ApiOperation({ summary: 'List CRM teams with search and pagination' })
  findAll(
    @Query() query: QueryTeamDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_team')
  @ApiOperation({ summary: 'Get active CRM teams for dropdowns' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('dropdown/users')
  @Permissions('read_crm_team')
  @ApiOperation({ summary: 'Get active users for team leader and member dropdowns' })
  userDropdown(@CurrentUser() currentUser: any) {
    return this.service.userDropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_team')
  @ApiOperation({ summary: 'Get CRM team details by UUID with leader and members' })
  findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, undefined, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_team')
  @ApiOperation({ summary: 'Update CRM team details by UUID, leader, or members' })
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateTeamDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_team')
  @ApiOperation({ summary: 'Soft delete a CRM team by UUID' })
  remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_team')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM team by UUID' })
  restore(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
