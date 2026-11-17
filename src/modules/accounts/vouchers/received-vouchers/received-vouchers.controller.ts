import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VouchersService } from './received-vouchers.service';
import { CreateVoucherDto } from './dto/create-received-voucher.dto';
import { GetVouchersQueryDto } from './dto/query-received-voucher.dto';
import { UpdateReceivedVoucherDto } from './dto/update-received-voucher.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('Accounts | vouchers | received-vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Permissions('create_received_voucher')
  @ApiOperation({ summary: 'Create received voucher' })
  create(
    @Body() createVoucherDto: CreateVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.create(createVoucherDto, userId, currentUser);
  }

  @Get()
  @Permissions('list_received_voucher')
  @ApiOperation({ summary: 'List received vouchers' })
  findAll(
    @Query() query: GetVouchersQueryDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.findAll(query, currentUser);
  }

  @Get(':uuid')
  @Permissions('read_received_voucher')
  @ApiOperation({ summary: 'Get received voucher by UUID' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_received_voucher')
  @ApiOperation({ summary: 'Update received voucher (PATCH)' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  updateWithPatch(
    @Param('uuid') uuid: string, 
    @Body() updateVoucherDto: UpdateReceivedVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.update(uuid, updateVoucherDto, userId, currentUser);
  }

  @Put(':uuid')
  @Permissions('update_received_voucher')
  @ApiOperation({ summary: 'Update received voucher (PUT)' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  updateWithPut(
    @Param('uuid') uuid: string, 
    @Body() updateVoucherDto: UpdateReceivedVoucherDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.update(uuid, updateVoucherDto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_received_voucher')
  @ApiOperation({ summary: 'Delete received voucher' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_received_voucher')
  @ApiOperation({ summary: 'Restore received voucher' })
  @ApiParam({ name: 'uuid', required: true, type: String, format: 'uuid' })
  restore(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.vouchersService.restore(uuid, userId, currentUser);
  }
}
