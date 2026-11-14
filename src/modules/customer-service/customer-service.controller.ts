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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from './common/customer-service-tenant.guard';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/auth.decorators';
import { CustomerServiceService } from './customer-service.service';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { QueryCustomerProfileDto } from './dto/query-customer-profile.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';

@ApiTags('Customer Service | Customer 360')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  CustomerServiceTenantGuard,
)
@Controller('customer-service')
export class CustomerServiceController {
  constructor(
    private readonly customerService: CustomerServiceService,
  ) {}

  // 1. Static route: Stats
  @Get('customers/stats')
  @ApiOperation({
    summary:
      'Get Customer 360 KPI summary metrics (snake_case)',
  })
  getCustomerStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.customerService.getCustomerStats(
      projectId,
      user,
    );
  }

  // 2. Static route: Dropdown metadata (statuses, relations)
  @Get('customers/dropdown/meta')
  @ApiOperation({
    summary:
      'Get customer dropdown metadata and enums',
  })
  getDropdownMeta() {
    return this.customerService.getDropdownMeta();
  }

  // 3. Static route: Dropdown options
  @Get('customers/dropdown')
  @ApiOperation({
    summary:
      'Get customer dropdown options [{ value, label, uuid }]',
  })
  getCustomersDropdown(
    @Query('search') search?: string,
    @CurrentUser() user?: any,
  ) {
    return this.customerService.getCustomersDropdown(
      search,
      user,
    );
  }

  // 4. Collection route: List with search, pagination, filter
  @Get('customers')
  @ApiOperation({
    summary:
      'List customer profiles with search and filter (snake_case)',
  })
  findCustomers(
    @Query() query: QueryCustomerProfileDto,
    @CurrentUser() user?: any,
  ) {
    return this.customerService.findCustomers(
      query,
      user,
    );
  }

  // 5. Param route: Detail 360 by UUID
  @Get('customers/:uuid')
  @ApiOperation({
    summary:
      'Get complete Customer 360 profile by UUID (snake_case)',
  })
  getCustomer360Profile(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.customerService.getCustomer360Profile(
      uuid,
      user,
    );
  }

  // 6. Create customer profile
  @Post('customers')
  @ApiOperation({
    summary:
      'Create new customer profile (snake_case body)',
  })
  createCustomer(
    @Body() dto: CreateCustomerProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.customerService.createCustomerProfile(
      dto,
      user,
    );
  }

  // 7. Update customer profile
  @Patch('customers/:uuid')
  @ApiOperation({
    summary: 'Update customer profile',
  })
  updateCustomer(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCustomerProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.customerService.updateCustomerProfile(
      uuid,
      dto,
      user,
    );
  }

  // 8. Soft delete customer profile
  @Delete('customers/:uuid')
  @ApiOperation({
    summary: 'Soft delete customer profile',
  })
  removeCustomer(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.customerService.removeCustomerProfile(
      uuid,
      user,
    );
  }

  // 9. Restore soft-deleted customer profile
  @Patch('customers/:uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted customer profile',
  })
  restoreCustomer(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.customerService.restoreCustomerProfile(
      uuid,
      user,
    );
  }

  @Post('customers/:uuid/restore')
  @ApiOperation({
    summary:
      'Restore soft-deleted customer profile (POST alternative)',
  })
  restoreCustomerPost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.customerService.restoreCustomerProfile(
      uuid,
      user,
    );
  }
}
