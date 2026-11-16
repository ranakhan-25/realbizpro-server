import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrSetupService } from './cr-setup.service';
import {
  CreateCrInstallmentSetupDto,
  UpdateCrInstallmentSetupDto,
} from './dto/create-cr-setup.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Credit Realization - Installment Setups & Policies')
@ApiBearerAuth()
@Controller('credit-realization/setups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrSetupController {
  constructor(private readonly service: CrSetupService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Create an installment policy plan setup' })
  @ApiBody({ type: CreateCrInstallmentSetupDto })
  async create(@Body() createDto: CreateCrInstallmentSetupDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all installment setups' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get installment setup by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
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
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete installment setup' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
