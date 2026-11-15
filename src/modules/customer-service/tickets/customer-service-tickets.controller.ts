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
import { CustomerServiceTicketsService } from './customer-service-tickets.service';
import {
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
  QueryServiceTicketDto,
  CreateTicketReplyDto,
} from './dto';

@ApiTags('Customer Service - Tickets & Service Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-service/tickets')
export class CustomerServiceTicketsController {
  constructor(
    private readonly ticketsService: CustomerServiceTicketsService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get Customer Service Tickets overview KPI stats' })
  @ApiResponse({ status: 200, description: 'Tickets KPI metrics' })
  async getTicketStats(
    @CurrentUser() user: any,
    @Query('project_id') projectId?: string,
  ) {
    return this.ticketsService.getTicketStats(user, projectId);
  }

  @Get()
  @ApiOperation({ summary: 'List customer service tickets with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated tickets list' })
  async findAllTickets(
    @CurrentUser() user: any,
    @Query() query: QueryServiceTicketDto,
  ) {
    return this.ticketsService.findAllTickets(user, query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get ticket details by UUID' })
  @ApiResponse({ status: 200, description: 'Ticket detail' })
  async findTicketByUuid(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.ticketsService.findTicketByUuid(user, uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Create new customer service ticket with auto SLA timer' })
  @ApiResponse({ status: 201, description: 'Created ticket item' })
  async createTicket(
    @CurrentUser() user: any,
    @Body() dto: CreateServiceTicketDto,
  ) {
    return this.ticketsService.createTicket(user, dto);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update ticket details or status' })
  @ApiResponse({ status: 200, description: 'Updated ticket item' })
  async updateTicket(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateServiceTicketDto,
  ) {
    return this.ticketsService.updateTicket(user, uuid, dto);
  }

  @Post(':uuid/replies')
  @ApiOperation({ summary: 'Add reply or internal log message to ticket conversation' })
  @ApiResponse({ status: 200, description: 'Updated ticket item with new reply' })
  async addReply(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
    @Body() dto: CreateTicketReplyDto,
  ) {
    return this.ticketsService.addReply(user, uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete a customer service ticket' })
  @ApiResponse({ status: 200, description: 'Ticket removed' })
  async removeTicket(
    @CurrentUser() user: any,
    @Param('uuid') uuid: string,
  ) {
    return this.ticketsService.removeTicket(user, uuid);
  }
}
