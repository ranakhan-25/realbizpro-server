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
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { BoqComparisonService } from './boqcomparison.service';
import { CreateBoqComparisonDto } from './dto/create-boqcomparison.dto';
import { QueryBoqComparisonDto } from './dto/query-boqcomparison.dto';
import { UpdateBoqComparisonDto } from './dto/update-boqcomparison.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Project | boq-comparison ")
@Controller('boq-comparison')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BoqComparisonController {
  constructor(private readonly boqComparisonService: BoqComparisonService) {}

  @Post()
  @Permissions('create_boq_comparison')
  create(@Body() dto: CreateBoqComparisonDto) {
    return this.boqComparisonService.create(dto);
  }

  @Get()
  @Permissions('view_boq_comparisons')
  findAll(@Query() query: QueryBoqComparisonDto) {
    return this.boqComparisonService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_boq_comparison')
  findOne(@Param('uuid') uuid: string) {
    return this.boqComparisonService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_boq_comparison')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBoqComparisonDto,
  ) {
    return this.boqComparisonService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_boq_comparison')
  remove(@Param('uuid') uuid: string) {
    return this.boqComparisonService.remove(uuid);
  }

  @Post(':uuid/restore')
  @Permissions('restore_boq_comparison')
  restore(@Param('uuid') uuid: string) {
    return this.boqComparisonService.restore(uuid);
  }
}