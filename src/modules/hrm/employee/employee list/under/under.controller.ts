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

import { UnderService } from './under.service';
import { CreateUnderDto } from './dto/create-under.dto';
import { QueryUnderDto } from './dto/query-under.dto';
import { UpdateUnderDto } from './dto/update-under.dto';

@ApiTags('Under')
@ApiBearerAuth()
@Controller('under')
export class UnderController {
  constructor(
    private readonly underService: UnderService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new under',
  })
  create(
    @Body()
    createUnderDto: CreateUnderDto,
  ) {
    return this.underService.create(
      createUnderDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all unders (paginated)',
  })
  findAll(
    @Query()
    query: QueryUnderDto,
  ) {
    return this.underService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get under by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.underService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update under',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateUnderDto: UpdateUnderDto,
  ) {
    return this.underService.update(
      uuid,
      updateUnderDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete under (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.underService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted under (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.underService.restore(uuid);
  }
}
