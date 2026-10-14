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

import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { QueryOvertimeDto } from './dto/query-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@ApiTags('Overtime')
@ApiBearerAuth()
@Controller('overtime')
export class OvertimeController {
  constructor(
    private readonly overtimeService: OvertimeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new overtime',
  })
  create(
    @Body()
    createOvertimeDto: CreateOvertimeDto,
  ) {
    return this.overtimeService.create(
      createOvertimeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all overtimes (paginated)',
  })
  findAll(
    @Query()
    query: QueryOvertimeDto,
  ) {
    return this.overtimeService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get overtime by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.overtimeService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update overtime',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateOvertimeDto: UpdateOvertimeDto,
  ) {
    return this.overtimeService.update(
      uuid,
      updateOvertimeDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete overtime',
  })
  remove(@Param('uuid') uuid: string) {
    return this.overtimeService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted overtime',
  })
  restore(@Param('uuid') uuid: string) {
    return this.overtimeService.restore(uuid);
  }
}
