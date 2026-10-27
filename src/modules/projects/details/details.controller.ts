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
import { DetailsService } from './details.service';
import { CreateDetailsDto } from './dto/create-detail.dto';
import { QueryDetailsDto } from './dto/query-detail.dto';
import { UpdateDetailsDto } from './dto/update-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Project | Details")
@Controller('details')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  @Permissions('create_project_detail')
  create(@Body() dto: CreateDetailsDto) {
    return this.detailsService.create(dto);
  }

  @Get()
  @Permissions('view_project_details')
  findAll(@Query() query: QueryDetailsDto) {
    return this.detailsService.findAll(query);
  }

  @Get(':uuid')
  @Permissions('view_project_detail')
  findOne(@Param('uuid') uuid: string) {
    return this.detailsService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('update_project_detail')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDetailsDto,
  ) {
    return this.detailsService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Permissions('delete_project_detail')
  remove(@Param('uuid') uuid: string) {
    return this.detailsService.remove(uuid);
  }

  @Post(':uuid/restore')
  @Permissions('restore_project_detail')
  restore(@Param('uuid') uuid: string) {
    return this.detailsService.restore(uuid);
  }
}