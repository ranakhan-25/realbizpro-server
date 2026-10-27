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

import { BoqService } from './boq.service';
import { CreateBoqDto } from './dto/create-boq.dto';
import { QueryBoqDto } from './dto/query-boq.dto';
import { UpdateBoqDto } from './dto/update-boq.dto';

@ApiTags('Projects | BOQ')
@ApiBearerAuth()
@Controller('boq')
export class BoqController {
  constructor(
    private readonly boqService: BoqService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new BOQ',
  })
  create(
    @Body()
    createBoqDto: CreateBoqDto,
  ) {
    return this.boqService.create(
      createBoqDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all BOQs (paginated)',
  })
  findAll(
    @Query()
    query: QueryBoqDto,
  ) {
    return this.boqService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get BOQ by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.boqService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update BOQ',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateBoqDto: UpdateBoqDto,
  ) {
    return this.boqService.update(
      uuid,
      updateBoqDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete BOQ',
  })
  remove(@Param('uuid') uuid: string) {
    return this.boqService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted BOQ',
  })
  restore(@Param('uuid') uuid: string) {
    return this.boqService.restore(uuid);
  }
}
