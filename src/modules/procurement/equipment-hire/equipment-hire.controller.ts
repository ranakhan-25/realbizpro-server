import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EquipmentHireService } from './equipment-hire.service';
import {
  CreateHireOrderDto,
  QueryEquipmentSiteDto,
  QueryHireMovementDto,
  QueryHireOrderDto,
} from './dto/equipment-hire.dto';

@ApiTags('Procurement | Hire Orders')
@ApiBearerAuth()
@Controller('procurement/hire-orders')
export class HireOrderController {
  constructor(
    private readonly service: EquipmentHireService,
  ) {}
  @Get('dropdowns')
  @ApiOperation({
    summary:
      'Projects, sites, vendors, approved equipment requisitions, assets, units and status dropdowns',
  })
  dropdowns(
    @Query('project_id') projectId?: string,
  ) {
    return this.service.dropdowns(projectId);
  }
  @Get('trash') trash(@Query() query: QueryHireOrderDto) { return this.service.listDeletedOrders(query); }
  @Get()
  @ApiOperation({
    summary: 'List/filter hire orders',
  })
  list(@Query() query: QueryHireOrderDto) {
    return this.service.listOrders(query);
  }
  @Post()
  @ApiOperation({
    summary:
      'Create requisition-based or free-hire order with equipment lines and calculated totals',
  })
  create(
    @Body() dto: CreateHireOrderDto,
    @Req() req: any,
  ) {
    return this.service.createOrder(
      dto,
      req.user?.id,
    );
  }
  @Get(':uuid') view(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.viewOrder(uuid);
  }
  @Patch(':uuid') update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CreateHireOrderDto,
    @Req() req: any,
  ) {
    return this.service.updateOrder(
      uuid,
      dto,
      req.user?.id,
    );
  }
  @Delete(':uuid') remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: any,
  ) {
    return this.service.deleteOrder(
      uuid,
      req.user?.id,
    );
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.restoreOrder(uuid);
  }
}

@ApiTags('Procurement | Hire In')
@ApiBearerAuth()
@Controller('procurement/hire-ins')
export class HireInController {
  constructor(
    private readonly service: EquipmentHireService,
  ) {}
  @Get('trash') trash(@Query() query: QueryHireMovementDto) { return this.service.listDeletedHireIns(query); }
  @Get() list(
    @Query() query: QueryHireMovementDto,
  ) {
    return this.service.listHireIns(query);
  }
  @Get(':uuid') view(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.viewHireIn(uuid);
  }
  @Delete(':uuid') remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: any,
  ) {
    return this.service.deleteEntity(
      'hireIn',
      uuid,
      req.user?.id,
    );
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.restoreEntity(
      'hireIn',
      uuid,
    );
  }
}

@ApiTags('Procurement | Hire Out')
@ApiBearerAuth()
@Controller('procurement/hire-outs')
export class HireOutController {
  constructor(
    private readonly service: EquipmentHireService,
  ) {}
  @Get('trash') trash(@Query() query: QueryHireMovementDto) { return this.service.listDeletedHireOuts(query); }
  @Get() list(
    @Query() query: QueryHireMovementDto,
  ) {
    return this.service.listHireOuts(query);
  }
  @Get(':uuid') view(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.viewHireOut(uuid);
  }
  @Delete(':uuid') remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: any,
  ) {
    return this.service.deleteEntity(
      'hireOut',
      uuid,
      req.user?.id,
    );
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.restoreEntity(
      'hireOut',
      uuid,
    );
  }
}

@ApiTags('Procurement | Equipment Bills')
@ApiBearerAuth()
@Controller('procurement/equipment-bills')
export class HireBillController {
  constructor(
    private readonly service: EquipmentHireService,
  ) {}
  @Get('trash') trash(@Query() query: QueryHireMovementDto) { return this.service.listDeletedBills(query); }
  @Get('dropdowns') dropdowns() {
    return this.service.dropdowns();
  }
  @Get() list(
    @Query() query: QueryHireMovementDto,
  ) {
    return this.service.listBills(query);
  }
  @Get(':uuid') view(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.viewBill(uuid);
  }
  @Delete(':uuid') remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: any,
  ) {
    return this.service.deleteEntity(
      'bill',
      uuid,
      req.user?.id,
    );
  }
  @Patch(':uuid/restore') restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.service.restoreEntity(
      'bill',
      uuid,
    );
  }
}

@ApiTags('Procurement | Equipment On Site')
@ApiBearerAuth()
@Controller('procurement/equipment-on-site')
export class EquipmentOnSiteController {
  constructor(
    private readonly service: EquipmentHireService,
  ) {}
  @Get('dropdowns') dropdowns() {
    return this.service.onSiteDropdowns();
  }
  @Get()
  @ApiOperation({
    summary:
      'Get equipment currently on site for a project, based on Hire In less Hire Out quantities',
  })
  list(@Query() query: QueryEquipmentSiteDto) {
    return this.service.onSite(query);
  }
}
