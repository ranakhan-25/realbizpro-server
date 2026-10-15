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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('HRM | Department')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new department',
  })
  create(
    @Body()
    createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(
      createDepartmentDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all departments (paginated)',
  })
  findAll(
    @Query()
    query: QueryDepartmentDto,
  ) {
    return this.departmentService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get department by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.departmentService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update department',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(
      uuid,
      updateDepartmentDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete department (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.departmentService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted department (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.departmentService.restore(uuid);
  }
}
