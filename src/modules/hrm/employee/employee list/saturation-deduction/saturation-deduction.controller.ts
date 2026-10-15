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

import { SaturationDeductionService } from './saturation-deduction.service';
import { CreateSaturationDeductionDto } from './dto/create-saturation-deduction.dto';
import { QuerySaturationDeductionDto } from './dto/query-saturation-deduction.dto';
import { UpdateSaturationDeductionDto } from './dto/update-saturation-deduction.dto';

@ApiTags('HRM | Employee | Saturation Deduction')
@ApiBearerAuth()
@Controller('saturation-deduction')
export class SaturationDeductionController {
  constructor(
    private readonly saturationDeductionService: SaturationDeductionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new saturation deduction',
  })
  create(
    @Body()
    createSaturationDeductionDto: CreateSaturationDeductionDto,
  ) {
    return this.saturationDeductionService.create(
      createSaturationDeductionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all saturation deductions (paginated)',
  })
  findAll(
    @Query()
    query: QuerySaturationDeductionDto,
  ) {
    return this.saturationDeductionService.findAll(
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get saturation deduction by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.saturationDeductionService.findOne(
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update saturation deduction',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateSaturationDeductionDto: UpdateSaturationDeductionDto,
  ) {
    return this.saturationDeductionService.update(
      uuid,
      updateSaturationDeductionDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete saturation deduction',
  })
  remove(@Param('uuid') uuid: string) {
    return this.saturationDeductionService.remove(
      uuid,
    );
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted saturation deduction',
  })
  restore(@Param('uuid') uuid: string) {
    return this.saturationDeductionService.restore(
      uuid,
    );
  }
}
