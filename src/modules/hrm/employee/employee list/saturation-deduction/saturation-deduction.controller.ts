/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaturationDeductionService } from './saturation-deduction.service';
import { CreateSaturationDeductionDto } from './dto/create-saturation-deduction.dto';
import { QuerySaturationDeductionDto } from './dto/query-saturation-deduction.dto';
import { UpdateSaturationDeductionDto } from './dto/update-saturation-deduction.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Saturation Deduction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('saturation-deduction')
export class SaturationDeductionController {
  constructor(private readonly saturationDeductionService: SaturationDeductionService) {}

  @Post()
  @Permissions('create_saturation_deduction')
  @ApiOperation({ summary: 'Create saturation deduction' })
  create(
    @Body() dto: CreateSaturationDeductionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_saturation_deduction')
  @ApiOperation({ summary: 'Get all saturation deductions (paginated)' })
  findAll(
    @Query() query: QuerySaturationDeductionDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_saturation_deduction')
  @ApiOperation({ summary: 'Get saturation deduction by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_saturation_deduction')
  @ApiOperation({ summary: 'Update saturation deduction' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSaturationDeductionDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_saturation_deduction')
  @ApiOperation({ summary: 'Delete saturation deduction' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_saturation_deduction')
  @ApiOperation({ summary: 'Restore soft-deleted saturation deduction' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.saturationDeductionService.restore(uuid, userId, currentUser);
  }
}
