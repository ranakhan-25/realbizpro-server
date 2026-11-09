import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { InvestorService } from './investor.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { QueryInvestorDto } from './dto/query-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@ApiTags('Project | Investments | Investor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('investor')
export class InvestorController {
  constructor(
    private readonly investorService: InvestorService,
  ) {}

  @Post()
  @Permissions('create_projects_investor')
  @ApiOperation({
    summary: 'Create a new investor',
  })
  create(
    @Body() createInvestorDto: CreateInvestorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.investorService.create(createInvestorDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_projects_investor')
  @ApiOperation({
    summary: 'Get all investors (paginated)',
  })
  findAll(
    @Query() query: QueryInvestorDto, @CurrentUser() currentUser: any
  ) {
    return this.investorService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_projects_investor')
  @ApiOperation({
    summary: 'Get investor by UUID',
  })
  findOne(
    @Param('uuid') uuid: string, @CurrentUser() currentUser: any
  ) {
    return this.investorService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_projects_investor')
  @ApiOperation({ summary: 'Update investor' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateInvestorDto: UpdateInvestorDto, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.investorService.update(uuid,
      updateInvestorDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_projects_investor')
  @ApiOperation({
    summary:
      'Soft delete investor (status → inactive)',
  })
  remove(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.investorService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_investor')
  @ApiOperation({
    summary:
      'Restore soft-deleted investor (status → active)',
  })
  restore(
    @Param('uuid') uuid: string, @CurrentUserId() userId: number, @CurrentUser() currentUser: any
  ) {
    return this.investorService.restore(uuid, userId, currentUser);
  }
}
