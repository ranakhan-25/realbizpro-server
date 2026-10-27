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
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BoqController {
  constructor(
    private readonly boqService: BoqService,
  ) {}

  @Post()
  @Permissions('create_boq')
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
  @Permissions('view_boqs')
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
  @Permissions('view_boq')
  @ApiOperation({
    summary: 'Get BOQ by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.boqService.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_boq')
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
  @Permissions('delete_boq')
  @ApiOperation({
    summary: 'Soft delete BOQ',
  })
  remove(@Param('uuid') uuid: string) {
    return this.boqService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @Permissions('restore_boq')
  @ApiOperation({
    summary: 'Restore soft-deleted BOQ',
  })
  restore(@Param('uuid') uuid: string) {
    return this.boqService.restore(uuid);
  }
}
