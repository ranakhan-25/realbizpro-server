/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaryGradeService } from './salary-grade.service';
import { CreateSalaryGradeDto } from './dto/create-salary-grade.dto';
import { QuerySalaryGradeDto } from './dto/query-salary-grade.dto';
import { UpdateSalaryGradeDto } from './dto/update-salary-grade.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Salary Grade')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('salary-grade')
export class SalaryGradeController {
  constructor(private readonly salaryGradeService: SalaryGradeService) {}

  @Post()
  @Permissions('create_salary_grade')
  @ApiOperation({ summary: 'Create salary grade' })
  create(
    @Body() dto: CreateSalaryGradeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_salary_grade')
  @ApiOperation({ summary: 'Get all salary grades (paginated)' })
  findAll(
    @Query() query: QuerySalaryGradeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_salary_grade')
  @ApiOperation({ summary: 'Get salary grade by UUID' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_salary_grade')
  @ApiOperation({ summary: 'Update salary grade' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSalaryGradeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_salary_grade')
  @ApiOperation({ summary: 'Delete salary grade' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_salary_grade')
  @ApiOperation({ summary: 'Restore soft-deleted salary grade' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.salaryGradeService.restore(uuid, userId, currentUser);
  }
}
