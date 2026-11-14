import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServicePropertyCareService } from './customer-service-property-care.service';
import {
  CreateDlpClaimDto,
  UpdateDlpClaimDto,
  QueryDlpClaimDto,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  QueryMaintenanceDto,
  CreateOwnersAssociationDto,
  UpdateOwnersAssociationDto,
  QueryOwnersAssociationDto,
} from './dto';

@ApiTags('Customer Service - Property Care, Warranty & Owners Associations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-service/property-care')
export class CustomerServicePropertyCareController {
  constructor(
    private readonly propertyCareService: CustomerServicePropertyCareService,
  ) {}

  // =============================================================
  // 1. DLP CLAIMS ENDPOINTS
  // =============================================================
  @Get('dlp-claims/stats')
  @ApiOperation({ summary: 'Get DLP claims KPI summary statistics' })
  @ApiResponse({ status: 200, description: 'DLP Claims KPI metrics' })
  async getDlpStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.propertyCareService.getDlpStats(user, projectId);
  }

  @Get('dlp-claims')
  @ApiOperation({ summary: 'List DLP Claims with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated DLP claims' })
  async findAllDlpClaims(
    @CurrentUser() user: any,
    @Query() query: QueryDlpClaimDto,
  ) {
    return this.propertyCareService.findAllDlpClaims(user, query);
  }

  @Get('dlp-claims/:uuid')
  @ApiOperation({ summary: 'Get DLP Claim by UUID' })
  @ApiResponse({ status: 200, description: 'DLP claim detail' })
  async findDlpClaimByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.findDlpClaimByUuid(user, uuid);
  }

  @Post('dlp-claims')
  @ApiOperation({ summary: 'Create new DLP Warranty Claim' })
  @ApiResponse({ status: 201, description: 'Claim created successfully' })
  async createDlpClaim(
    @CurrentUser() user: any,
    @Body() dto: CreateDlpClaimDto,
  ) {
    return this.propertyCareService.createDlpClaim(user, dto);
  }

  @Patch('dlp-claims/:uuid')
  @ApiOperation({ summary: 'Update DLP Claim' })
  @ApiResponse({ status: 200, description: 'Claim updated successfully' })
  async updateDlpClaim(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDlpClaimDto,
  ) {
    return this.propertyCareService.updateDlpClaim(user, uuid, dto);
  }

  @Patch('dlp-claims/:uuid/advance')
  @ApiOperation({ summary: 'Advance DLP Claim rectification stage' })
  @ApiResponse({ status: 200, description: 'Claim stage advanced successfully' })
  async advanceDlpClaimStage(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.advanceDlpClaimStage(user, uuid);
  }

  @Delete('dlp-claims/:uuid')
  @ApiOperation({ summary: 'Delete DLP Claim' })
  @ApiResponse({ status: 200, description: 'Claim deleted successfully' })
  async deleteDlpClaim(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.deleteDlpClaim(user, uuid);
  }

  // =============================================================
  // 2. MAINTENANCE REQUESTS ENDPOINTS
  // =============================================================
  @Get('maintenance-requests/stats')
  @ApiOperation({ summary: 'Get Maintenance Requests KPI metrics' })
  @ApiResponse({ status: 200, description: 'Maintenance KPI metrics' })
  async getMaintenanceStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.propertyCareService.getMaintenanceStats(user, projectId);
  }

  @Get('maintenance-requests')
  @ApiOperation({ summary: 'List Maintenance Requests with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated maintenance requests' })
  async findAllMaintenance(
    @CurrentUser() user: any,
    @Query() query: QueryMaintenanceDto,
  ) {
    return this.propertyCareService.findAllMaintenance(user, query);
  }

  @Get('maintenance-requests/:uuid')
  @ApiOperation({ summary: 'Get Maintenance Request by UUID' })
  @ApiResponse({ status: 200, description: 'Maintenance request detail' })
  async findMaintenanceByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.findMaintenanceByUuid(user, uuid);
  }

  @Post('maintenance-requests')
  @ApiOperation({ summary: 'Create new Maintenance Request' })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  async createMaintenance(
    @CurrentUser() user: any,
    @Body() dto: CreateMaintenanceDto,
  ) {
    return this.propertyCareService.createMaintenance(user, dto);
  }

  @Patch('maintenance-requests/:uuid')
  @ApiOperation({ summary: 'Update Maintenance Request' })
  @ApiResponse({ status: 200, description: 'Request updated successfully' })
  async updateMaintenance(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.propertyCareService.updateMaintenance(user, uuid, dto);
  }

  @Patch('maintenance-requests/:uuid/complete')
  @ApiOperation({ summary: 'Mark Maintenance Request as Completed' })
  @ApiResponse({ status: 200, description: 'Request completed successfully' })
  async completeMaintenance(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() body: { actual_cost?: number; remarks?: string },
  ) {
    return this.propertyCareService.completeMaintenance(
      user,
      uuid,
      body?.actual_cost,
      body?.remarks,
    );
  }

  @Delete('maintenance-requests/:uuid')
  @ApiOperation({ summary: 'Delete Maintenance Request' })
  @ApiResponse({ status: 200, description: 'Request deleted successfully' })
  async deleteMaintenance(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.deleteMaintenance(user, uuid);
  }

  // =============================================================
  // 3. FLAT OWNERS ASSOCIATIONS ENDPOINTS
  // =============================================================
  @Get('owners-associations/stats')
  @ApiOperation({ summary: 'Get Flat Owners Associations KPI metrics' })
  @ApiResponse({ status: 200, description: 'Associations KPI metrics' })
  async getOwnersAssociationStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.propertyCareService.getOwnersAssociationStats(user, projectId);
  }

  @Get('owners-associations')
  @ApiOperation({ summary: 'List Owners Associations with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated associations' })
  async findAllOwnersAssociations(
    @CurrentUser() user: any,
    @Query() query: QueryOwnersAssociationDto,
  ) {
    return this.propertyCareService.findAllOwnersAssociations(user, query);
  }

  @Get('owners-associations/:uuid')
  @ApiOperation({ summary: 'Get Owners Association by UUID' })
  @ApiResponse({ status: 200, description: 'Association detail' })
  async findOwnersAssociationByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.findOwnersAssociationByUuid(user, uuid);
  }

  @Post('owners-associations')
  @ApiOperation({ summary: 'Create new Owners Association Record' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  async createOwnersAssociation(
    @CurrentUser() user: any,
    @Body() dto: CreateOwnersAssociationDto,
  ) {
    return this.propertyCareService.createOwnersAssociation(user, dto);
  }

  @Patch('owners-associations/:uuid')
  @ApiOperation({ summary: 'Update Owners Association Record' })
  @ApiResponse({ status: 200, description: 'Association updated successfully' })
  async updateOwnersAssociation(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateOwnersAssociationDto,
  ) {
    return this.propertyCareService.updateOwnersAssociation(user, uuid, dto);
  }

  @Delete('owners-associations/:uuid')
  @ApiOperation({ summary: 'Delete Owners Association Record' })
  @ApiResponse({ status: 200, description: 'Association deleted successfully' })
  async deleteOwnersAssociation(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.propertyCareService.deleteOwnersAssociation(user, uuid);
  }
}
