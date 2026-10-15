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

import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { QueryAllowanceDto } from './dto/query-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';

@ApiTags('HRM | Allowance')
@ApiBearerAuth()
@Controller('allowance')
export class AllowanceController {
  constructor(
    private readonly allowanceService: AllowanceService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new allowance',
  })
  create(
    @Body()
    createAllowanceDto: CreateAllowanceDto,
  ) {
    return this.allowanceService.create(
      createAllowanceDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all allowances (paginated)',
  })
  findAll(
    @Query()
    query: QueryAllowanceDto,
  ) {
    return this.allowanceService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get allowance by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.allowanceService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update allowance',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateAllowanceDto: UpdateAllowanceDto,
  ) {
    return this.allowanceService.update(
      uuid,
      updateAllowanceDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete allowance',
  })
  remove(@Param('uuid') uuid: string) {
    return this.allowanceService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore soft-deleted allowance',
  })
  restore(@Param('uuid') uuid: string) {
    return this.allowanceService.restore(uuid);
  }
}
