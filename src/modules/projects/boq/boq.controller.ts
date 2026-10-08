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
import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { UpdateBoqDto } from './dto/update-boq.dto';
import { QueryBoqDto } from './dto/query-boq.dto';

@Controller('boq')
export class BoqController {
  constructor(private readonly boqService: BoqService) {}

  @Post()
  create(@Body() dto: CreateBoqDto) {
    return this.boqService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBoqDto) {
    return this.boqService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.boqService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBoqDto,
  ) {
    return this.boqService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.boqService.remove(uuid);
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.boqService.restore(uuid);
  }
}