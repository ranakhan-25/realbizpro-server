/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaryGradeItemService } from './salary-grade-item.service';
import { CreateSalaryGradeItemDto } from './dto/create-salary-grade-item.dto';
import { UpdateSalaryGradeItemDto } from './dto/update-salary-grade-item.dto';
import { QuerySalaryGradeItemDto } from './dto/query-salary-grade-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('salary-grade-item')
export class SalaryGradeItemController {
  constructor(private readonly salaryGradeItemService: SalaryGradeItemService) {}

  @Post()
  @Permissions('create_salary_grade_item')
  @ApiOperation({ summary: 'Create salary grade item' })
  create(
    @Body() dto: CreateSalaryGradeItemDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_salary_grade_item')
  @ApiOperation({ summary: 'Get all salary grade items (paginated)' })
  findAll(
    @Query() query: QuerySalaryGradeItemDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_salary_grade_item')
  @ApiOperation({ summary: 'Get salary grade item by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_salary_grade_item')
  @ApiOperation({ summary: 'Update salary grade item' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSalaryGradeItemDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_salary_grade_item')
  @ApiOperation({ summary: 'Delete salary grade item' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_salary_grade_item')
  @ApiOperation({ summary: 'Restore soft-deleted salary grade item' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeItemService.restore(uuid, userId, currentUser);
  }
}
