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

import { EmployeeTypeService } from './employee-type.service';
import { CreateEmployeeTypeDto } from './dto/create-employee-type.dto';
import { QueryEmployeeTypeDto } from './dto/query-employee-type.dto';
import { UpdateEmployeeTypeDto } from './dto/update-employee-type.dto';

@ApiTags('HRM | Employee | Employee Type')
@ApiBearerAuth()
@Controller('employee-type')
export class EmployeeTypeController {
  constructor(
    private readonly employeeTypeService: EmployeeTypeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee type',
  })
  create(
    @Body()
    createEmployeeTypeDto: CreateEmployeeTypeDto,
  ) {
    return this.employeeTypeService.create(
      createEmployeeTypeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all employee types (paginated)',
  })
  findAll(
    @Query()
    query: QueryEmployeeTypeDto,
  ) {
    return this.employeeTypeService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get employee type by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.employeeTypeService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update employee type',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateEmployeeTypeDto: UpdateEmployeeTypeDto,
  ) {
    return this.employeeTypeService.update(
      uuid,
      updateEmployeeTypeDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete employee type (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.employeeTypeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted employee type (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.employeeTypeService.restore(uuid);
  }
}
