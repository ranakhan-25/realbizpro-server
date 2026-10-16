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

import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { QueryShiftDto } from './dto/query-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@ApiTags('HRM | Employee | Shift')
@ApiBearerAuth()
@Controller('shift')
export class ShiftController {
  constructor(
    private readonly shiftService: ShiftService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new shift',
  })
  create(
    @Body()
    createShiftDto: CreateShiftDto,
  ) {
    return this.shiftService.create(
      createShiftDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all shifts (paginated)',
  })
  findAll(
    @Query()
    query: QueryShiftDto,
  ) {
    return this.shiftService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get shift by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.shiftService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update shift',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateShiftDto: UpdateShiftDto,
  ) {
    return this.shiftService.update(
      uuid,
      updateShiftDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete shift (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.shiftService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted shift (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.shiftService.restore(uuid);
  }
}
