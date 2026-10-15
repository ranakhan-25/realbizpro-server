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

import { IncrementService } from './increment.service';
import { CreateIncrementDto } from './dto/create-increment.dto';
import { QueryIncrementDto } from './dto/query-increment.dto';
import { UpdateIncrementDto } from './dto/update-increment.dto';

@ApiTags('Increment')
@ApiBearerAuth()
@Controller('increment')
export class IncrementController {
  constructor(
    private readonly incrementService: IncrementService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new increment',
  })
  create(
    @Body()
    createIncrementDto: CreateIncrementDto,
  ) {
    return this.incrementService.create(
      createIncrementDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all increments (paginated)',
  })
  findAll(
    @Query()
    query: QueryIncrementDto,
  ) {
    return this.incrementService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get increment by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.incrementService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update increment',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateIncrementDto: UpdateIncrementDto,
  ) {
    return this.incrementService.update(
      uuid,
      updateIncrementDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete increment (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.incrementService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted increment (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.incrementService.restore(uuid);
  }
}
