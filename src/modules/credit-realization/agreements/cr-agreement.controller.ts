import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrAgreementService } from './cr-agreement.service';
import {
  CreateCrSaleAgreementDto,
  UpdateCrSaleAgreementDto,
  CreateCrPlotDistributionDto,
} from './dto/create-cr-agreement.dto';

@ApiTags('Credit Realization - Sale Agreements & Allotments')
@Controller('credit-realization/agreements')
export class CrAgreementController {
  constructor(private readonly agreementService: CrAgreementService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a sale agreement and optionally auto-generate installment schedules',
  })
  @ApiBody({ type: CreateCrSaleAgreementDto })
  async create(@Body() createDto: CreateCrSaleAgreementDto) {
    return this.agreementService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sale agreements with installment schedule status' })
  async findAll() {
    return this.agreementService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get sale agreement details with full installment plan, plots & recovery history',
  })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.agreementService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a sale agreement' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrSaleAgreementDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrSaleAgreementDto,
  ) {
    return this.agreementService.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a sale agreement' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.agreementService.remove(uuid);
  }

  @Post(':uuid/plot-distribution')
  @ApiOperation({ summary: 'Allocate / attach plot distribution info to agreement' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: CreateCrPlotDistributionDto })
  async addPlotDistribution(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCrPlotDistributionDto,
  ) {
    return this.agreementService.addPlotDistribution(uuid, dto);
  }
}
