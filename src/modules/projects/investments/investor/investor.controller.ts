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

import { InvestorService } from './investor.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { QueryInvestorDto } from './dto/query-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@ApiTags('Project | Investments | Investor')
@ApiBearerAuth()
@Controller('investor')
export class InvestorController {
  constructor(
    private readonly investorService: InvestorService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new investor',
  })
  create(
    @Body() createInvestorDto: CreateInvestorDto,
  ) {
    return this.investorService.create(
      createInvestorDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all investors (paginated)',
  })
  findAll(@Query() query: QueryInvestorDto) {
    return this.investorService.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get investor by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.investorService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update investor' })
  update(
    @Param('uuid') uuid: string,
    @Body() updateInvestorDto: UpdateInvestorDto,
  ) {
    return this.investorService.update(
      uuid,
      updateInvestorDto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'Soft delete investor (status → inactive)',
  })
  remove(@Param('uuid') uuid: string) {
    return this.investorService.remove(uuid);
  }

  @Patch(':uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted investor (status → active)',
  })
  restore(@Param('uuid') uuid: string) {
    return this.investorService.restore(uuid);
  }
}
