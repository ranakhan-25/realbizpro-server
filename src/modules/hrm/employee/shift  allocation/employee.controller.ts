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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
@ApiTags('HRM | Employee')
@ApiBearerAuth()
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly service: EmployeeService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new employee',
  })
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }
  @Get()
  @ApiOperation({
    summary:
      'Get all employee records (paginated)',
  })
  findAll(@Query() query: QueryEmployeeDto) {
    return this.service.findAll(query);
  }
  @Get(':uuid')
  @ApiOperation({
    summary: 'Get employee by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update employee' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete employee',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted employee',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
