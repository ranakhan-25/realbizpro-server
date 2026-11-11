/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowanceDeductionSetupService } from './allowance-deduction-setup.service';
import { CreateAllowanceDeductionSetupDto } from './dto/create-allowance-deduction-setup.dto';
import { QueryAllowanceDeductionSetupDto } from './dto/query-allowance-deduction-setup.dto';
import { UpdateAllowanceDeductionSetupDto } from './dto/update-allowance-deduction-setup.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('allowance-deduction-setup')
export class AllowanceDeductionSetupController {
  constructor(private readonly allowanceDeductionSetupService: AllowanceDeductionSetupService) {}

  @Post()
  @Permissions('create_allowance_deduction_setup')
  @ApiOperation({ summary: 'Create allowance deduction setup' })
  create(
    @Body() dto: CreateAllowanceDeductionSetupDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_allowance_deduction_setup')
  @ApiOperation({ summary: 'Get all allowance deduction setups (paginated)' })
  findAll(
    @Query() query: QueryAllowanceDeductionSetupDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_allowance_deduction_setup')
  @ApiOperation({ summary: 'Get allowance deduction setup by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_allowance_deduction_setup')
  @ApiOperation({ summary: 'Update allowance deduction setup' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateAllowanceDeductionSetupDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_allowance_deduction_setup')
  @ApiOperation({ summary: 'Delete allowance deduction setup' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_allowance_deduction_setup')
  @ApiOperation({ summary: 'Restore soft-deleted allowance deduction setup' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.allowanceDeductionSetupService.restore(uuid, userId, currentUser);
  }
}
