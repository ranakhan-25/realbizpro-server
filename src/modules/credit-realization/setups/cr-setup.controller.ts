import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrSetupService } from './cr-setup.service';
import {
  CreateCrInstallmentSetupDto,
  UpdateCrInstallmentSetupDto,
} from './dto/create-cr-setup.dto';

@ApiTags('Credit Realization - Installment Setups & Policies')
@Controller('credit-realization/setups')
export class CrSetupController {
  constructor(private readonly service: CrSetupService) {}

  @Post()
  @ApiOperation({ summary: 'Create an installment policy plan setup' })
  @ApiBody({ type: CreateCrInstallmentSetupDto })
  async create(@Body() createDto: CreateCrInstallmentSetupDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all installment setups' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get installment setup by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update installment setup' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrInstallmentSetupDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrInstallmentSetupDto,
  ) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete installment setup' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
