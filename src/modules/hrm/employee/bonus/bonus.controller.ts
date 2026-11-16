/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BonusService } from './bonus.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { QueryBonusDto } from './dto/query-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Bonus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Post()
  @Permissions('create_bonus')
  @ApiOperation({ summary: 'Create bonus' })
  create(
    @Body() dto: CreateBonusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_bonus')
  @ApiOperation({ summary: 'Get all bonuss (paginated)' })
  findAll(
    @Query() query: QueryBonusDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_bonus')
  @ApiOperation({ summary: 'Get bonus by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_bonus')
  @ApiOperation({ summary: 'Update bonus' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBonusDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_bonus')
  @ApiOperation({ summary: 'Delete bonus' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_bonus')
  @ApiOperation({ summary: 'Restore soft-deleted bonus' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusService.restore(uuid, userId, currentUser);
  }
}
