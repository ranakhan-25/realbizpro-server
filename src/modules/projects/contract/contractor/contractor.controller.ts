import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { QueryContractorDto } from './dto/query-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@ApiTags('Project | Contract | Contractor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('contractor')
export class ContractorController {
  constructor(
    private readonly contractorService: ContractorService,
  ) {}

  @Get('reports/at-a-glance')
  @Permissions('read_projects_contractor')
  @ApiOperation({ summary: 'Contractor at-a-glance report' })
  atAGlanceReport(
    @Query() query: QueryContractorDto, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.findAll(query, currentUser);
  }

  @Get('reports/project-summary')
  @Permissions('read_projects_contractor')
  @ApiOperation({ summary: 'Contractor summary report' })
  projectSummaryReport(
    @Query() query: QueryContractorDto, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.findAll(query, currentUser);
  }

  @Post()
  @Permissions('create_projects_contractor')
  @ApiOperation({
    summary: 'Create a new contractor',
  })
  create(
    @Body()
    createContractorDto: CreateContractorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.create(createContractorDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_contractor')
  @ApiOperation({
    summary: 'Get all contractors (paginated)',
  })
  findAll(
    @Query()
    query: QueryContractorDto, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_contractor')
  @ApiOperation({
    summary: 'Get contractor by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_contractor')
  @ApiOperation({
    summary: 'Update contractor',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateContractorDto: UpdateContractorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.update(uuid,
      updateContractorDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_contractor')
  @ApiOperation({
    summary:
      'Soft delete contractor (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_contractor')
  @ApiOperation({
    summary:
      'Restore soft-deleted contractor (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.contractorService.restore(uuid, userId, currentUser);
  }
}
