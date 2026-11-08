import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { QueryProfessionDto } from './dto/query-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ProfessionService } from './profession.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Profession')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/professions')
export class ProfessionController {
  constructor(private readonly service: ProfessionService) {}

  @Post()
  @Permissions('create_crm_profession')
  @ApiOperation({ summary: 'Create a CRM profession' })
  create(
    @Body() dto: CreateProfessionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_profession')
  @ApiOperation({ summary: 'List professions with search, status, and pagination filters' })
  findAll(
    @Query() query: QueryProfessionDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown/statuses')
  @Permissions('read_crm_profession')
  @ApiOperation({ summary: 'Get profession statuses for the form dropdown' })
  statusDropdown() {
    return this.service.statusDropdown();
  }

  @Get(':uuid')
  @Permissions('read_crm_profession')
  @ApiOperation({ summary: 'Get profession details by UUID, including related leads' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_profession')
  @ApiOperation({ summary: 'Update a CRM profession by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProfessionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_profession')
  @ApiOperation({ summary: 'Soft delete a CRM profession by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_profession')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM profession by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
