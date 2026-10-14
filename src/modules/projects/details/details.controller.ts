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
import { DetailsService } from './details.service';
import { CreateDetailsDto } from './dto/create-detail.dto';
import { QueryDetailsDto } from './dto/query-detail.dto';
import { UpdateDetailsDto } from './dto/update-detail.dto';

@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  create(@Body() dto: CreateDetailsDto) {
    return this.detailsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryDetailsDto) {
    return this.detailsService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.detailsService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDetailsDto,
  ) {
    return this.detailsService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.detailsService.remove(uuid);
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.detailsService.restore(uuid);
  }
}