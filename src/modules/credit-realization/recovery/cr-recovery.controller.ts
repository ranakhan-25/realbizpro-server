import { Controller, Post, Get, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CrRecoveryService } from './cr-recovery.service';
import {
  CreateCrRecoveryLogDto,
  UpdateCrRecoveryLogDto,
} from './dto/create-cr-recovery.dto';

@ApiTags('Credit Realization - Recovery Actions & Field Follow-up')
@Controller('credit-realization/recovery')
export class CrRecoveryController {
  constructor(private readonly service: CrRecoveryService) {}

  @Post()
  @ApiOperation({ summary: 'Log a recovery action, call, notice, or customer promise' })
  @ApiBody({ type: CreateCrRecoveryLogDto })
  async create(@Body() createDto: CreateCrRecoveryLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all recovery logs with agreement details' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get recovery log details by UUID' })
  @ApiParam({ name: 'uuid' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
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
  @ApiOperation({ summary: 'Delete recovery log' })
  @ApiParam({ name: 'uuid' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
