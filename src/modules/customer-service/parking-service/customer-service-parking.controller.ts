import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceParkingService } from './customer-service-parking.service';
import {
  CreateParkingSlotDto,
  UpdateParkingSlotDto,
  QueryParkingSlotDto,
  CreateParkingAssignmentDto,
  ReleaseParkingAssignmentDto,
  QueryParkingAssignmentDto,
  CreateExternalRentalDto,
  CollectRentalPaymentDto,
  TerminateExternalRentalDto,
  QueryExternalRentalDto,
} from './dto';

@ApiTags(
  'Customer Service - Building Services | Parking Service',
)
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller('customer-service/parking')
export class CustomerServiceParkingController {
  constructor(
    private readonly parkingService: CustomerServiceParkingService,
  ) {}

  // =========================================================================
  // METADATA & INCOME SUMMARY
  // =========================================================================

  @Get('dropdown/meta')
  @ApiOperation({
    summary:
      'Get parking metadata (floors/zones, vehicle types, available free slots)',
  })
  async getDropdownMeta(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.parkingService.getDropdownMeta(
      user,
      projectId,
    );
  }

  @Get('income-summary')
  @ApiOperation({
    summary:
      'Monthly parking income summary (collected vs due rent, occupancy rates)',
  })
  async getMonthlyIncomeSummary(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.parkingService.getMonthlyIncomeSummary(
      user,
      projectId,
    );
  }

  // =========================================================================
  // 1. PARKING SLOTS
  // =========================================================================

  @Post('slots')
  @ApiOperation({
    summary:
      'Create new parking slot (unique slot_number per project)',
  })
  async createSlot(
    @CurrentUser() user: any,
    @Body() dto: CreateParkingSlotDto,
  ) {
    return this.parkingService.createSlot(
      user,
      dto,
    );
  }

  @Get('slots')
  @ApiOperation({
    summary:
      'List parking slots with floor/zone, status, and search filters',
  })
  async getSlots(
    @CurrentUser() user: any,
    @Query() query: QueryParkingSlotDto,
  ) {
    return this.parkingService.getSlots(
      user,
      query,
    );
  }

  @Get('slots/:uuid')
  @ApiOperation({
    summary: 'Get single parking slot by UUID',
  })
  async getSlotByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.parkingService.getSlotByUuid(
      user,
      uuid,
    );
  }

  @Put('slots/:uuid')
  @ApiOperation({
    summary: 'Update parking slot details',
  })
  async updateSlot(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateParkingSlotDto,
  ) {
    return this.parkingService.updateSlot(
      user,
      uuid,
      dto,
    );
  }

  @Delete('slots/:uuid')
  @ApiOperation({
    summary:
      'Soft delete parking slot (fails if slot is currently occupied or rented)',
  })
  async deleteSlot(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.parkingService.deleteSlot(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 2. PARKING ASSIGNMENTS (Resident Flat Owners)
  // =========================================================================

  @Post('assignments')
  @ApiOperation({
    summary:
      'Assign parking slot to resident flat owner (blocks double assignment)',
  })
  async createAssignment(
    @CurrentUser() user: any,
    @Body() dto: CreateParkingAssignmentDto,
  ) {
    return this.parkingService.createAssignment(
      user,
      dto,
    );
  }

  @Patch('assignments/:uuid/release')
  @ApiOperation({
    summary:
      'Release parking slot from resident and return slot to FREE status',
  })
  async releaseAssignment(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: ReleaseParkingAssignmentDto,
  ) {
    return this.parkingService.releaseAssignment(
      user,
      uuid,
      dto,
    );
  }

  @Get('assignments')
  @ApiOperation({
    summary:
      'List parking assignments with active status filter and search',
  })
  async getAssignments(
    @CurrentUser() user: any,
    @Query() query: QueryParkingAssignmentDto,
  ) {
    return this.parkingService.getAssignments(
      user,
      query,
    );
  }

  @Get('assignments/:uuid')
  @ApiOperation({
    summary:
      'Get single parking assignment by UUID',
  })
  async getAssignmentByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.parkingService.getAssignmentByUuid(
      user,
      uuid,
    );
  }

  // =========================================================================
  // 3. EXTERNAL RENTALS (Outsider Rentals Funding Building Maintenance)
  // =========================================================================

  @Post('rentals')
  @ApiOperation({
    summary:
      'Rent parking slot to outsider/commercial vehicle (funds building costs)',
  })
  async createExternalRental(
    @CurrentUser() user: any,
    @Body() dto: CreateExternalRentalDto,
  ) {
    return this.parkingService.createExternalRental(
      user,
      dto,
    );
  }

  @Patch('rentals/:uuid/payment')
  @ApiOperation({
    summary:
      'Record external rental payment collection',
  })
  async collectRentalPayment(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: CollectRentalPaymentDto,
  ) {
    return this.parkingService.collectRentalPayment(
      user,
      uuid,
      dto,
    );
  }

  @Patch('rentals/:uuid/terminate')
  @ApiOperation({
    summary:
      'Terminate external rental and return slot to FREE status',
  })
  async terminateExternalRental(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: TerminateExternalRentalDto,
  ) {
    return this.parkingService.terminateExternalRental(
      user,
      uuid,
      dto,
    );
  }

  @Get('rentals')
  @ApiOperation({
    summary:
      'List external rentals with payment and rental status filters',
  })
  async getExternalRentals(
    @CurrentUser() user: any,
    @Query() query: QueryExternalRentalDto,
  ) {
    return this.parkingService.getExternalRentals(
      user,
      query,
    );
  }

  @Get('rentals/:uuid')
  @ApiOperation({
    summary: 'Get single external rental by UUID',
  })
  async getExternalRentalByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.parkingService.getExternalRentalByUuid(
      user,
      uuid,
    );
  }
}
