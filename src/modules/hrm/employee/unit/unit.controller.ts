/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { QueryUnitDto } from './dto/query-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Unit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('unit')
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
  ) {}

  @Post()
  @Permissions('create_unit')
  @ApiOperation({ summary: 'Create unit' })
  create(
    @Body() dto: CreateUnitDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.create(
      dto,
      userId,
      currentUser,
    );
  }

  @Get()
  @Permissions('list_unit')
  @ApiOperation({
    summary: 'Get all units (paginated)',
  })
  findAll(
    @Query() query: QueryUnitDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.findAll(
      query,
      currentUser,
    );
  }

  @Get(':uuid')
  @Permissions('read_unit')
  @ApiOperation({ summary: 'Get unit by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.findOne(
      uuid,
      currentUser,
    );
  }

  @Patch(':uuid')
  @Permissions('update_unit')
  @ApiOperation({ summary: 'Update unit' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUnitDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.update(
      uuid,
      dto,
      userId,
      currentUser,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_unit')
  @ApiOperation({ summary: 'Delete unit' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.remove(
      uuid,
      userId,
      currentUser,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('update_unit')
  @ApiOperation({
    summary: 'Restore soft-deleted unit',
  })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.unitService.restore(
      uuid,
      userId,
      currentUser,
    );
  }
}
