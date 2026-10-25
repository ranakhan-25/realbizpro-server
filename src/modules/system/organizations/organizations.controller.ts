import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrganizationsService } from './organizations.service';
import { CreateOrganizationWizardDto } from './dto/create-organization-wizard.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ToggleLockDto } from './dto/toggle-lock.dto';
import { UpdateEntitlementsDto } from './dto/update-entitlements.dto';
import {
  EntitledModuleSummaryDto,
  OrganizationResponseDto,
} from './dto/organization-response.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('System | Organizations & Multi-Tenant')
@Controller(['system/organizations', 'organizations'])
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all organizations (Super Admin)',
    description: 'Returns all tenants with their subscription package, user limits, lock status, and active users count.',
  })
  @ApiQuery({ name: 'status', required: false, enum: ['trial', 'active', 'past_due', 'expired', 'locked', 'canceled'] })
  @ApiQuery({ name: 'isLocked', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: [OrganizationResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('isLocked') isLocked?: boolean,
    @Query('search') search?: string,
  ): Promise<OrganizationResponseDto[]> {
    return this.orgService.findAll({ status, isLocked, search });
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'Get organizations dropdown list',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations dropdown retrieved successfully',
  })
  async getDropdown(): Promise<{ id: number; name: string }[]> {
    return this.orgService.getDropdown();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single organization details',
    description: 'Returns organization profile, subscription status, admin user, and entitled module/feature tree.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async findOne(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.orgService.findOne(id);
  }

  @Post('wizard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Super Admin 3-Step Creation Wizard (Atomic)',
    description:
      'Creates 1) Organization record with plan duration, 2) Org Admin credentials, and 3) Module & Feature Entitlements in a single atomic database transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Organization, admin user, and entitlements created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Organization code, user email, or username already exists',
  })
  async createWizard(
    @Body() wizardDto: CreateOrganizationWizardDto,
  ): Promise<OrganizationResponseDto> {
    return this.orgService.createWizard(wizardDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization profile and quota overrides',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.orgService.update(id, updateDto);
  }

  @Patch(':id/subscription')
  @ApiOperation({
    summary: 'Renew, extend, change plan, or cancel subscription',
    description: 'Updates tenant expiration date and syncs quotas with new plan if changed.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
    type: OrganizationResponseDto,
  })
  async updateSubscription(
    @Param('id') id: string,
    @Body() subDto: UpdateSubscriptionDto,
  ): Promise<OrganizationResponseDto> {
    return this.orgService.updateSubscription(id, subDto);
  }

  @Patch(':id/lock')
  @ApiOperation({
    summary: 'Lock or unlock organization and its users',
    description: 'Instantly locks out all users of the tenant when marked locked.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Tenant lock state toggled',
    type: OrganizationResponseDto,
  })
  async toggleLock(
    @Param('id') id: string,
    @Body() lockDto: ToggleLockDto,
  ): Promise<OrganizationResponseDto> {
    return this.orgService.toggleLock(id, lockDto);
  }

  @Get(':id/entitlements')
  @ApiOperation({
    summary: 'Get tree of entitled modules and features for organization',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Entitlements tree returned',
    type: [EntitledModuleSummaryDto],
  })
  async getEntitlements(@Param('id') id: string): Promise<EntitledModuleSummaryDto[]> {
    return this.orgService.getEntitlements(id);
  }

  @Put(':id/entitlements')
  @ApiOperation({
    summary: 'Mutate/update entitled modules and features for organization',
    description: 'Replaces the organization access list with the provided module/feature tree.',
  })
  @ApiParam({ name: 'id', description: 'Organization ID or UUID' })
  @ApiResponse({
    status: 200,
    description: 'Entitlements updated successfully',
    type: [EntitledModuleSummaryDto],
  })
  async updateEntitlements(
    @Param('id') id: string,
    @Body() dto: UpdateEntitlementsDto,
  ): Promise<EntitledModuleSummaryDto[]> {
    return this.orgService.updateEntitlements(id, dto);
  }
}
