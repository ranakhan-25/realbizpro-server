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

import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { QueryContractorDto } from './dto/query-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@ApiTags('Contractor')
@ApiBearerAuth()
@Controller('contractor')
export class ContractorController {
  constructor(
    private readonly contractorService: ContractorService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new contractor',
  })
  create(
    @Body()
    createContractorDto: CreateContractorDto,
  ) {
    return this.contractorService.create(
      createContractorDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all contractors (paginated)',
  })
  findAll(
    @Query()
    query: QueryContractorDto,
  ) {
    return this.contractorService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get contractor by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.contractorService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update contractor',
  })
  update(
    @Param('uuid') uuid: string,
    @Body()
    updateContractorDto: UpdateContractorDto,
  ) {
    return this.contractorService.update(
      uuid,
      updateContractorDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete contractor (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.contractorService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted contractor (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.contractorService.restore(uuid);
  }
}
