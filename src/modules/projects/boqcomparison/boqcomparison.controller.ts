import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';
/* eslint-disable prettier/prettier */

import {
  Patch,
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
import { BoqComparisonService } from './boqcomparison.service';
import { CreateBoqComparisonDto } from './dto/create-boqcomparison.dto';
import { QueryBoqComparisonDto } from './dto/query-boqcomparison.dto';
import { UpdateBoqComparisonDto } from './dto/update-boqcomparison.dto';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Project | boq-comparison ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('boq-comparison')
export class BoqComparisonController {
  constructor(
    private readonly boqComparisonService: BoqComparisonService,
  ) {}

  @Post()
  @Permissions('create_projects_boq_comparison')
  create(
    @Body() dto: CreateBoqComparisonDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.create(
      dto,
      userId,
      currentUser,
    );
  }

  @Get()
  @Permissions('list_projects_boq_comparison')
  findAll(
    @Query() query: QueryBoqComparisonDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.findAll(
      query,
      currentUser,
    );
  }

  @Get(':uuid')
  @Permissions('read_projects_boq_comparison')
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.findOne(
      uuid,
      currentUser,
    );
  }

  @Put(':uuid')
  @Permissions('update_projects_boq_comparison')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateBoqComparisonDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.update(
      uuid,
      dto,
      userId,
      currentUser,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_projects_boq_comparison')
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.remove(
      uuid,
      userId,
      currentUser,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('update_projects_boq_comparison')
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.boqComparisonService.restore(
      uuid,
      userId,
      currentUser,
    );
  }
}
