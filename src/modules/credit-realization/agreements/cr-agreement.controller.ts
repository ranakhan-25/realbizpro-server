import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrAgreementService } from './cr-agreement.service';
import {
  CreateCrSaleAgreementDto,
  UpdateCrSaleAgreementDto,
  CreateCrPlotDistributionDto,
} from './dto/create-cr-agreement.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Credit Realization - Sale Agreements & Allotments')
@ApiBearerAuth()
@Controller('credit-realization/agreements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrAgreementController {
  constructor(private readonly agreementService: CrAgreementService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({
    summary: 'Create a sale agreement and optionally auto-generate installment schedules',
  })
  @ApiBody({ type: CreateCrSaleAgreementDto })
  async create(@Body() createDto: CreateCrSaleAgreementDto) {
    return this.agreementService.create(createDto);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all sale agreements with installment schedule status' })
  async findAll() {
    return this.agreementService.findAll();
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({
    summary: 'Get sale agreement details with full installment plan, plots & recovery history',
  })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.agreementService.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
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
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete a sale agreement' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.agreementService.remove(uuid);
  }

  @Post(':uuid/plot-distribution')
  @Permissions('credit-realization:write')
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
