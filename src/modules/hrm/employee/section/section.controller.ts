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

import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { QuerySectionDto } from './dto/query-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('HRM | Employee | Section')
@ApiBearerAuth()
@Controller('section')
export class SectionController {
  constructor(
    private readonly sectionService: SectionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new section',
  })
  create(
    @Body()
    createSectionDto: CreateSectionDto,
  ) {
    return this.sectionService.create(
      createSectionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all sections (paginated)',
  })
  findAll(
    @Query()
    query: QuerySectionDto,
  ) {
    return this.sectionService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get section by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.sectionService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update section',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionService.update(
      uuid,
      updateSectionDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete section (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.sectionService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted section (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.sectionService.restore(uuid);
  }
}
