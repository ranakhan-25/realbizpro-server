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

import { ShareConfigurationService } from './share-configuration.service';

import { CreateShareConfigurationDto } from './dto/create-share-configuration.dto';

import { QueryShareConfigurationDto } from './dto/query-share-configuration.dto';

import { UpdateShareConfigurationDto } from './dto/update-share-configuration.dto';

@ApiTags('Share Configuration')
@ApiBearerAuth()
@Controller('share-configuration')
export class ShareConfigurationController {
  constructor(
    private readonly shareConfigurationService: ShareConfigurationService,
  ) {}

  @Post()
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
  @ApiOperation({
    summary: 'Get share configuration by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.shareConfigurationService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
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
