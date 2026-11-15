import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceUtilityService } from './customer-service-utility.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { QueryTechnicianDto } from './dto/query-technician.dto';
import { CreateWarrantyItemDto } from './dto/create-warranty-item.dto';
import { UpdateWarrantyItemDto } from './dto/update-warranty-item.dto';
import { QueryWarrantyItemDto } from './dto/query-warranty-item.dto';
import { CreateUtilityTicketDto } from './dto/create-utility-ticket.dto';
import { UpdateUtilityTicketDto } from './dto/update-utility-ticket.dto';
import { QueryUtilityTicketDto } from './dto/query-utility-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@ApiTags('Customer Service - Building Services | Utility Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/utility')
export class CustomerServiceUtilityController {
  constructor(
    private readonly utilityService: CustomerServiceUtilityService,
  ) {}

  // ==========================================
  // 1. TICKETS ENDPOINTS
  // ==========================================

  @Get('tickets/stats')
  @ApiOperation({ summary: 'Get utility tickets overview KPI stats' })
  getTicketStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.getTicketStats(projectId, user);
  }

  @Get('tickets/dropdown/meta')
  @ApiOperation({
    summary:
      'Get dropdown metadata (technicians, warranty fixtures, categories, statuses)',
  })
  getDropdownMeta(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.getDropdownMeta(projectId, user);
  }

  @Get('tickets')
  @ApiOperation({
    summary:
      'List utility tickets with FIFO queue serial ordering and filters',
  })
  findTickets(
    @Query() query: QueryUtilityTicketDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.findTickets(query, user);
  }

  @Post('tickets')
  @ApiOperation({
    summary:
      'Create utility ticket with auto project serial & active warranty FREE/PAID logic',
  })
  createTicket(
    @Body() dto: CreateUtilityTicketDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.createTicket(dto, user);
  }

  @Get('tickets/:uuid')
  @ApiOperation({ summary: 'Get utility ticket details by UUID' })
  findTicketByUuid(
    @Param('uuid') uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.findTicketByUuid(uuid, user);
  }

  @Patch('tickets/:uuid')
  @ApiOperation({ summary: 'Update utility ticket' })
  updateTicket(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUtilityTicketDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.updateTicket(uuid, dto, user);
  }

  @Patch('tickets/:uuid/assign')
  @ApiOperation({ summary: 'Assign technician to utility ticket' })
  assignTechnician(
    @Param('uuid') uuid: string,
    @Body() dto: AssignTechnicianDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.assignTechnician(uuid, dto, user);
  }

  @Patch('tickets/:uuid/status')
  @ApiOperation({
    summary:
      'Advance utility ticket workflow status (In Progress, Resolved, Handed Over, Closed)',
  })
  updateTicketStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateTicketStatusDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.updateTicketStatus(uuid, dto, user);
  }

  @Delete('tickets/:uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete utility ticket' })
  removeTicket(
    @Param('uuid') uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.removeTicket(uuid, user);
  }

  // ==========================================
  // 2. TECHNICIANS ENDPOINTS
  // ==========================================

  @Get('technicians')
  @ApiOperation({ summary: 'List utility technicians' })
  findTechnicians(
    @Query() query: QueryTechnicianDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.findTechnicians(query, user);
  }

  @Post('technicians')
  @ApiOperation({ summary: 'Create new utility technician' })
  createTechnician(
    @Body() dto: CreateTechnicianDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.createTechnician(dto, user);
  }

  @Patch('technicians/:uuid')
  @ApiOperation({ summary: 'Update utility technician' })
  updateTechnician(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateTechnicianDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.updateTechnician(uuid, dto, user);
  }

  @Delete('technicians/:uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete technician' })
  removeTechnician(
    @Param('uuid') uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.removeTechnician(uuid, user);
  }

  // ==========================================
  // 3. WARRANTY ITEMS ENDPOINTS
  // ==========================================

  @Get('warranty-items/stats')
  @ApiOperation({ summary: 'Get warranty registry overview stats' })
  getWarrantyStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.getWarrantyStats(projectId, user);
  }

  @Get('warranty-items')
  @ApiOperation({
    summary:
      'List warranty registry items (switch, socket, tap, shower, fittings ONLY)',
  })
  findWarrantyItems(
    @Query() query: QueryWarrantyItemDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.findWarrantyItems(query, user);
  }

  @Post('warranty-items')
  @ApiOperation({ summary: 'Register new fixture warranty item' })
  createWarrantyItem(
    @Body() dto: CreateWarrantyItemDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.createWarrantyItem(dto, user);
  }

  @Patch('warranty-items/:uuid')
  @ApiOperation({ summary: 'Update warranty fixture item' })
  updateWarrantyItem(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateWarrantyItemDto,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.updateWarrantyItem(uuid, dto, user);
  }

  @Delete('warranty-items/:uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete warranty fixture item' })
  removeWarrantyItem(
    @Param('uuid') uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.utilityService.removeWarrantyItem(uuid, user);
  }
}
