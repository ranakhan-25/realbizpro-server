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
import { MonthYearService } from './month-year.service';
import { CreateMonthYearDto } from './dto/create-month-year.dto';
import { QueryMonthYearDto } from './dto/query-month-year.dto';
import { UpdateMonthYearDto } from './dto/update-month-year.dto';
@ApiTags('HRM | Employee | MonthYear')
@ApiBearerAuth()
@Controller('month-year')
export class MonthYearController {
  constructor(
    private readonly service: MonthYearService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new month-year',
  })
  create(@Body() dto: CreateMonthYearDto) {
    return this.service.create(dto);
  }
  @Get()
  @ApiOperation({
    summary:
      'Get all month-year records (paginated)',
  })
  findAll(@Query() query: QueryMonthYearDto) {
    return this.service.findAll(query);
  }
  @Get(':uuid')
  @ApiOperation({
    summary: 'Get month-year by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update month-year' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateMonthYearDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete month-year',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted month-year',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
