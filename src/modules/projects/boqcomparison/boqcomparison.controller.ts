/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { BoqComparisonService } from './boqcomparison.service';
import { CreateBoqComparisonDto } from './dto/create-boqcomparison.dto';
import { QueryBoqComparisonDto } from './dto/query-boqcomparison.dto';
import { UpdateBoqComparisonDto } from './dto/update-boqcomparison.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Project | boq-comparison ")
@Controller('boq-comparison')
export class BoqComparisonController {
  constructor(private readonly boqComparisonService: BoqComparisonService) {}

  @Post()
  create(@Body() dto: CreateBoqComparisonDto) {
    return this.boqComparisonService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBoqComparisonDto) {
    return this.boqComparisonService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.boqComparisonService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBoqComparisonDto,
  ) {
    return this.boqComparisonService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.boqComparisonService.remove(uuid);
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.boqComparisonService.restore(uuid);
  }
}