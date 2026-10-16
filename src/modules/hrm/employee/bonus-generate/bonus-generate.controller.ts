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

import { BonusGenerateService } from './bonus-generate.service';
import { CreateBonusGenerateDto } from './dto/create-bonus-generate.dto';
import { QueryBonusGenerateDto } from './dto/query-bonus-generate.dto';
import { UpdateBonusGenerateDto } from './dto/update-bonus-generate.dto';

@ApiTags('HRM | Employee | Bonus Generate')
@ApiBearerAuth()
@Controller('bonus-generate')
export class BonusGenerateController {
  constructor(
    private readonly bonusGenerateService: BonusGenerateService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Generate bonus for an employee',
  })
  create(
    @Body()
    createBonusGenerateDto: CreateBonusGenerateDto,
  ) {
    return this.bonusGenerateService.create(
      createBonusGenerateDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all generated bonuses (paginated)',
  })
  findAll(
    @Query()
    query: QueryBonusGenerateDto,
  ) {
    return this.bonusGenerateService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get generated bonus by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.bonusGenerateService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update generated bonus',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateBonusGenerateDto: UpdateBonusGenerateDto,
  ) {
    return this.bonusGenerateService.update(
      uuid,
      updateBonusGenerateDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete generated bonus (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.bonusGenerateService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted generated bonus (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.bonusGenerateService.restore(
      uuid,
    );
  }
}
