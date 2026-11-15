/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeductionRuleService } from './deduction-rule.service';
import { CreateDeductionRuleDto } from './dto/create-deduction-rule.dto';
import { QueryDeductionRuleDto } from './dto/query-deduction-rule.dto';
import { UpdateDeductionRuleDto } from './dto/update-deduction-rule.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Configuration | Deduction Rule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('deduction-rule')
export class DeductionRuleController {
  constructor(private readonly deductionRuleService: DeductionRuleService) {}

  @Post()
  @Permissions('create_deduction_rule')
  @ApiOperation({ summary: 'Create deduction rule' })
  create(
    @Body() dto: CreateDeductionRuleDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_deduction_rule')
  @ApiOperation({ summary: 'Get all deduction rules (paginated)' })
  findAll(
    @Query() query: QueryDeductionRuleDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_deduction_rule')
  @ApiOperation({ summary: 'Get deduction rule by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_deduction_rule')
  @ApiOperation({ summary: 'Update deduction rule' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDeductionRuleDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_deduction_rule')
  @ApiOperation({ summary: 'Delete deduction rule' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_deduction_rule')
  @ApiOperation({ summary: 'Restore soft-deleted deduction rule' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.deductionRuleService.restore(uuid, userId, currentUser);
  }
}
