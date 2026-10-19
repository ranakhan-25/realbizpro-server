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

import { SalaryGradeItemService } from './salary-grade-item.service';

import { CreateSalaryGradeItemDto } from './dto/create-salary-grade-item.dto';

import { UpdateSalaryGradeItemDto } from './dto/update-salary-grade-item.dto';

import { QuerySalaryGradeItemDto } from './dto/query-salary-grade-item.dto';

@ApiTags(
  'HRM | Configuration | Salary Grade Item',
)
@ApiBearerAuth()
@Controller('salary-grade-item')
export class SalaryGradeItemController {
  constructor(
    private readonly salaryGradeItemService: SalaryGradeItemService,
  ) {}

  // ---------- CREATE ----------

  @Post()
  @ApiOperation({
    summary: 'Create a new salary grade item',
  })
  create(
    @Body()
    createDto: CreateSalaryGradeItemDto,
  ) {
    return this.salaryGradeItemService.create(
      createDto,
    );
  }

  // ---------- FIND ALL ----------

  @Get()
  @ApiOperation({
    summary: 'Get all salary grade items',
  })
  findAll(
    @Query()
    query: QuerySalaryGradeItemDto,
  ) {
    return this.salaryGradeItemService.findAll(
      query,
    );
  }

  // ---------- FIND ONE ----------

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get salary grade item by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.salaryGradeItemService.findOne(
      uuid,
    );
  }

  // ---------- UPDATE ----------

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update salary grade item',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateDto: UpdateSalaryGradeItemDto,
  ) {
    return this.salaryGradeItemService.update(
      uuid,
      updateDto,
    );
  }

  // ---------- SOFT DELETE ----------

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete salary grade item',
  })
  remove(
    @Param('uuid') uuid: string,
    @Query('deletedById') deletedById?: string,
  ) {
    return this.salaryGradeItemService.remove(
      uuid,
      deletedById,
    );
  }

  // ---------- RESTORE ----------

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted salary grade item',
  })
  restore(@Param('uuid') uuid: string) {
    return this.salaryGradeItemService.restore(
      uuid,
    );
  }
}
