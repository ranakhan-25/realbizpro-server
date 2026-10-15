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

import { BonusService } from './bonus.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { QueryBonusDto } from './dto/query-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';

@ApiTags('HRM | Bonus')
@ApiBearerAuth()
@Controller('bonus')
export class BonusController {
  constructor(
    private readonly bonusService: BonusService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new bonus',
  })
  create(
    @Body()
    createBonusDto: CreateBonusDto,
  ) {
    return this.bonusService.create(
      createBonusDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bonuses (paginated)',
  })
  findAll(
    @Query()
    query: QueryBonusDto,
  ) {
    return this.bonusService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get bonus by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.bonusService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update bonus',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateBonusDto: UpdateBonusDto,
  ) {
    return this.bonusService.update(
      uuid,
      updateBonusDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete bonus (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.bonusService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted bonus (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.bonusService.restore(uuid);
  }
}
