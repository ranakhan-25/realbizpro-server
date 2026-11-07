import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { QueryPriceRangeDto } from './dto/query-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';
import { PriceRangeService } from './price-range.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Price Range')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/price-ranges')
export class PriceRangeController {
  constructor(private readonly service: PriceRangeService) {}

  @Post()
  @Permissions('create_crm_price_range')
  @ApiOperation({ summary: 'Create a CRM price range using From Price and To Price' })
  create(
    @Body() dto: CreatePriceRangeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_price_range')
  @ApiOperation({ summary: 'List CRM price ranges with search and pagination' })
  findAll(
    @Query() query: QueryPriceRangeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_price_range')
  @ApiOperation({ summary: 'Get CRM price ranges for lead forms' })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get(':uuid')
  @Permissions('read_crm_price_range')
  @ApiOperation({ summary: 'Get a CRM price range by UUID with related leads' })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_price_range')
  @ApiOperation({ summary: 'Update a CRM price range by UUID' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePriceRangeDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_price_range')
  @ApiOperation({ summary: 'Soft-delete a CRM price range by UUID' })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_price_range')
  @ApiOperation({ summary: 'Restore a soft-deleted CRM price range by UUID' })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
