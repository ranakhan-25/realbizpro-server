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

import { ShareConfigurationService } from './share-configuration.service';

import { CreateShareConfigurationDto } from './dto/create-share-configuration.dto';

import { QueryShareConfigurationDto } from './dto/query-share-configuration.dto';

import { UpdateShareConfigurationDto } from './dto/update-share-configuration.dto';

@ApiTags('Project | Investments | Share Configuration')
@ApiBearerAuth()
@Controller('share-configuration')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ShareConfigurationController {
  constructor(
    private readonly shareConfigurationService: ShareConfigurationService,
  ) {}

  @Post()
  @Permissions('create_share_configuration')
  @ApiOperation({
    summary: 'Create a new share configuration',
  })
  create(
    @Body()
    createShareConfigurationDto: CreateShareConfigurationDto,
  ) {
    return this.shareConfigurationService.create(
      createShareConfigurationDto,
    );
  }

  @Get()
  @Permissions('view_share_configurations')
  @ApiOperation({
    summary:
      'Get all share configurations (paginated)',
  })
  findAll(
    @Query()
    query: QueryShareConfigurationDto,
  ) {
    return this.shareConfigurationService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @Permissions('view_share_configuration')
  @ApiOperation({
    summary: 'Get share configuration by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.shareConfigurationService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @Permissions('update_share_configuration')
  @ApiOperation({
    summary: 'Update share configuration',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateShareConfigurationDto: UpdateShareConfigurationDto,
  ) {
    return this.shareConfigurationService.update(
      uuid,
      updateShareConfigurationDto,
    );
  }

  @Delete(':uuid')
  @Permissions('delete_share_configuration')
  @ApiOperation({
    summary:
      'Soft delete share configuration (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.shareConfigurationService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @Permissions('restore_share_configuration')
  @ApiOperation({
    summary:
      'Restore soft-deleted share configuration (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.shareConfigurationService.restore(
      uuid,
    );
  }
}
