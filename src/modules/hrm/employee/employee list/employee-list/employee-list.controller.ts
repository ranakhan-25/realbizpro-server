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

import { EmployeeListService } from './employee-list.service';
import { CreateEmployeeListDto } from './dto/create-employee-list.dto';
import {
  FindOneEmployeeListQueryDto,
  QueryEmployeeListDto,
} from './dto/query-employee-list.dto';
import { UpdateEmployeeListDto } from './dto/update-employee-list.dto';

@ApiTags('HRM | Employee |Employee List')
@ApiBearerAuth()
@Controller('employee-list')
export class EmployeeListController {
  constructor(
    private readonly employeeListService: EmployeeListService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee',
  })
  create(
    @Body()
    createEmployeeListDto: CreateEmployeeListDto,
  ) {
    return this.employeeListService.create(
      createEmployeeListDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all employees (paginated)',
  })
  findAll(
    @Query()
    query: QueryEmployeeListDto,
  ) {
    return this.employeeListService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get employee by UUID',
  })
  findOne(
    @Param('uuid') uuid: string,
    @Query()
    query: FindOneEmployeeListQueryDto,
  ) {
    return this.employeeListService.findOne(
      uuid,
      query.withRelations,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update employee',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateEmployeeListDto: UpdateEmployeeListDto,
  ) {
    return this.employeeListService.update(
      uuid,
      updateEmployeeListDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete employee (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.employeeListService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted employee (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.employeeListService.restore(uuid);
  }
}
