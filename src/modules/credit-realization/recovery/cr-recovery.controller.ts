import { Controller, Post, Get, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CrRecoveryService } from './cr-recovery.service';
import {
  CreateCrRecoveryLogDto,
  UpdateCrRecoveryLogDto,
} from './dto/create-cr-recovery.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('Credit Realization - Recovery Actions & Field Follow-up')
@ApiBearerAuth()
@Controller('credit-realization/recovery')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrRecoveryController {
  constructor(private readonly service: CrRecoveryService) {}

  @Post()
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Log a recovery action, call, notice, or customer promise' })
  @ApiBody({ type: CreateCrRecoveryLogDto })
  async create(@Body() createDto: CreateCrRecoveryLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'List all recovery logs with agreement details' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @Permissions('credit-realization:read')
  @ApiOperation({ summary: 'Get recovery log details by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update recovery log (PUT)' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrRecoveryLogDto })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrRecoveryLogDto,
  ) {
    return this.service.update(uuid, updateDto);
  }

  @Patch(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Update recovery log (PATCH)' })
  @ApiParam({ name: 'uuid' })
  @ApiBody({ type: UpdateCrRecoveryLogDto })
  async patch(
    @Param('uuid') uuid: string,
    @Body() updateDto: UpdateCrRecoveryLogDto,
  ) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('credit-realization:write')
  @ApiOperation({ summary: 'Delete recovery log' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
