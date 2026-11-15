/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BonusGenerateService } from './bonus-generate.service';
import { CreateBonusGenerateDto } from './dto/create-bonus-generate.dto';
import { QueryBonusGenerateDto } from './dto/query-bonus-generate.dto';
import { UpdateBonusGenerateDto } from './dto/update-bonus-generate.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Bonus Generate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bonus-generate')
export class BonusGenerateController {
  constructor(private readonly bonusGenerateService: BonusGenerateService) {}

  @Post()
  @Permissions('create_bonus_generate')
  @ApiOperation({ summary: 'Create bonus generate' })
  create(
    @Body() dto: CreateBonusGenerateDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_bonus_generate')
  @ApiOperation({ summary: 'Get all bonus generates (paginated)' })
  findAll(
    @Query() query: QueryBonusGenerateDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_bonus_generate')
  @ApiOperation({ summary: 'Get bonus generate by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_bonus_generate')
  @ApiOperation({ summary: 'Update bonus generate' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBonusGenerateDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_bonus_generate')
  @ApiOperation({ summary: 'Delete bonus generate' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_bonus_generate')
  @ApiOperation({ summary: 'Restore soft-deleted bonus generate' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.bonusGenerateService.restore(uuid, userId, currentUser);
  }
}
