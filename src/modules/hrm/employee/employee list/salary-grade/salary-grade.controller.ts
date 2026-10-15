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

import { SalaryGradeService } from './salary-grade.service';
import { CreateSalaryGradeDto } from './dto/create-salary-grade.dto';
import { QuerySalaryGradeDto } from './dto/query-salary-grade.dto';
import { UpdateSalaryGradeDto } from './dto/update-salary-grade.dto';

@ApiTags('HRM | Employee | Salary Grade')
@ApiBearerAuth()
@Controller('salary-grade')
export class SalaryGradeController {
  constructor(
    private readonly salaryGradeService: SalaryGradeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new salary grade',
  })
  create(
    @Body()
    createSalaryGradeDto: CreateSalaryGradeDto,
  ) {
    return this.salaryGradeService.create(
      createSalaryGradeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all salary grades (paginated)',
  })
  findAll(
    @Query()
    query: QuerySalaryGradeDto,
  ) {
    return this.salaryGradeService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get salary grade by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.salaryGradeService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update salary grade',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateSalaryGradeDto: UpdateSalaryGradeDto,
  ) {
    return this.salaryGradeService.update(
      uuid,
      updateSalaryGradeDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete salary grade (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.salaryGradeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted salary grade (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.salaryGradeService.restore(uuid);
  }
}
