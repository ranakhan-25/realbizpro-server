import { Controller, Post, Body, Get, Query, Param, Delete, Patch, Put, ParseUUIDPipe } from '@nestjs/common';
import { VouchersService } from './received-vouchers.service';
import { CreateVoucherDto } from './dto/create-received-voucher.dto';
import { GetVouchersQueryDto } from './dto/query-received-voucher.dto';
import { UpdateReceivedVoucherDto } from './dto/update-received-voucher.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
@ApiTags("Accounts|vouchers|receivedd voucher|")
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get()
  // 👈 Ekhane DTO ta pass korun
  findAll(@Query() query: GetVouchersQueryDto) {
    return this.vouchersService.findAll(query);
  }

  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.vouchersService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  updateWithPatch(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateReceivedVoucherDto,
  ) {
    return this.vouchersService.update(uuid, dto);
  }

  @Put(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  updateWithPut(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateReceivedVoucherDto,
  ) {
    return this.vouchersService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.vouchersService.remove(uuid);
  }
}