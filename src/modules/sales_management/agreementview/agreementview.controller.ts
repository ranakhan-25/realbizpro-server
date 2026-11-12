import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AgreementsService } from './agreementview.service';
import {
  CreateAgreementDto,
  QueryAgreementDto,
  RestoreAgreementDto,
  UpdateAgreementDto,
} from './dto/index';
import { Agreement } from '../../../database/models/sales_management/sm_agreement_view.model';

@ApiTags('Agreements')
@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agreement' })
  @ApiResponse({ status: 201, type: Agreement })
  @ApiResponse({ status: 409, description: 'Agreement code already exists' })
  create(@Body() dto: CreateAgreementDto) {
    return this.agreementsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List agreements (search / filter / pagination)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['Signed', 'Pending', 'Draft'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'includeDeleted', required: false, example: false })
  findAll(@Query() query: QueryAgreementDto) {
    return this.agreementsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Aggregated statistics (counts + total value)' })
  getStats() {
    return this.agreementsService.getStats();
  }

  @Get('trash')
  @ApiOperation({ summary: 'List soft-deleted agreements' })
  findDeleted() {
    return this.agreementsService.findDeleted();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get agreement by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementsService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update agreement by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateAgreementDto,
  ) {
    return this.agreementsService.update(uuid, dto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete agreement by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementsService.remove(uuid);
  }

  @Delete(':uuid/force')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete agreement by UUID' })
  @ApiParam({ name: 'uuid', type: 'string', format: 'uuid' })
  forceRemove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agreementsService.forceRemove(uuid);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a single soft-deleted agreement' })
  restore(@Body() dto: RestoreAgreementDto) {
    return this.agreementsService.restore(dto);
  }

  @Post('restore-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore all soft-deleted agreements' })
  restoreAll() {
    return this.agreementsService.restoreAll();
  }
}
