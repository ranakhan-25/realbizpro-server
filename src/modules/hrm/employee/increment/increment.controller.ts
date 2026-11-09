/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncrementService } from './increment.service';
import { CreateIncrementDto } from './dto/create-increment.dto';
import { QueryIncrementDto } from './dto/query-increment.dto';
import { UpdateIncrementDto } from './dto/update-increment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Increment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('increment')
export class IncrementController {
  constructor(private readonly incrementService: IncrementService) {}

  @Post()
  @Permissions('create_increment')
  @ApiOperation({ summary: 'Create increment' })
  create(
    @Body() dto: CreateIncrementDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_increment')
  @ApiOperation({ summary: 'Get all increments (paginated)' })
  findAll(
    @Query() query: QueryIncrementDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_increment')
  @ApiOperation({ summary: 'Get increment by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_increment')
  @ApiOperation({ summary: 'Update increment' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateIncrementDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_increment')
  @ApiOperation({ summary: 'Delete increment' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_increment')
  @ApiOperation({ summary: 'Restore soft-deleted increment' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.incrementService.restore(uuid, userId, currentUser);
  }
}
