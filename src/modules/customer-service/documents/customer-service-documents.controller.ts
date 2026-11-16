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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomerServiceTenantGuard } from '../common/customer-service-tenant.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorators';
import { CustomerServiceDocumentsService } from './customer-service-documents.service';
import {
  CreateCustomerDocumentDto,
  UpdateCustomerDocumentDto,
  QueryCustomerDocumentDto,
  CreateRegistrationTrackingDto,
  UpdateRegistrationTrackingDto,
  QueryRegistrationTrackingDto,
  CreateMutationTrackingDto,
  UpdateMutationTrackingDto,
  QueryMutationTrackingDto,
} from './dto';

@ApiTags('Customer Service | Documents & Land Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CustomerServiceTenantGuard)
@Controller('customer-service/documents')
export class CustomerServiceDocumentsController {
  constructor(
    private readonly documentsService: CustomerServiceDocumentsService,
  ) {}

  // =========================================================================
  // 1. STATS (STATIC ROUTES FIRST)
  // =========================================================================

  @Get('stats')
  @ApiOperation({ summary: 'Get KPI statistics for Document Centre & Digital Vault' })
  @ApiResponse({ status: 200, description: 'Document stats calculated successfully' })
  getDocumentStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.getDocumentStats(user, projectId);
  }

  @Get('registration-tracking/stats')
  @ApiOperation({ summary: 'Get Sub-Registrar registration pipeline stats' })
  getRegistrationStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.getRegistrationStats(user, projectId);
  }

  @Get('mutation-tracking/stats')
  @ApiOperation({ summary: 'Get e-Mutation & Khatian KPI statistics' })
  getMutationStats(
    @Query('project_id') projectId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.getMutationStats(user, projectId);
  }

  // =========================================================================
  // 2. SUB-REGISTRAR REGISTRATION TRACKING ROUTES
  // =========================================================================

  @Get('registration-tracking')
  @ApiOperation({ summary: 'List and filter registration tracking records' })
  findAllRegistrations(
    @Query() query: QueryRegistrationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findAllRegistrations(user, query);
  }

  @Post('registration-tracking')
  @ApiOperation({ summary: 'Create a new Sub-Registrar registration tracking file' })
  createRegistration(
    @Body() dto: CreateRegistrationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.createRegistration(user, dto);
  }

  @Get('registration-tracking/:uuid')
  @ApiOperation({ summary: 'Get registration tracking details by UUID' })
  findRegistrationByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findRegistrationByUuid(user, uuid);
  }

  @Patch('registration-tracking/:uuid')
  @ApiOperation({ summary: 'Update registration tracking stage, fee status, or deed number' })
  updateRegistration(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateRegistrationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.updateRegistration(user, uuid, dto);
  }

  @Delete('registration-tracking/:uuid')
  @ApiOperation({ summary: 'Soft delete a registration tracking file' })
  removeRegistration(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.removeRegistration(user, uuid);
  }

  // =========================================================================
  // 3. E-MUTATION & KHATIAN TRACKING ROUTES
  // =========================================================================

  @Get('mutation-tracking')
  @ApiOperation({ summary: 'List and filter e-Mutation tracking applications' })
  findAllMutations(
    @Query() query: QueryMutationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findAllMutations(user, query);
  }

  @Post('mutation-tracking')
  @ApiOperation({ summary: 'Register a new e-Mutation application case' })
  createMutation(
    @Body() dto: CreateMutationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.createMutation(user, dto);
  }

  @Get('mutation-tracking/:uuid')
  @ApiOperation({ summary: 'Get e-Mutation case details by UUID' })
  findMutationByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findMutationByUuid(user, uuid);
  }

  @Patch('mutation-tracking/:uuid')
  @ApiOperation({ summary: 'Update e-Mutation inquiry stage, hearing date, DCR, or Khatian no' })
  updateMutation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateMutationTrackingDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.updateMutation(user, uuid, dto);
  }

  @Delete('mutation-tracking/:uuid')
  @ApiOperation({ summary: 'Soft delete an e-Mutation case' })
  removeMutation(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.removeMutation(user, uuid);
  }

  // =========================================================================
  // 4. DIGITAL VAULT & DOCUMENT CENTRE (ROOT LEVEL WITH :uuid AT END)
  // =========================================================================

  @Get()
  @ApiOperation({ summary: 'List and filter archived customer documents' })
  @ApiResponse({ status: 200, description: 'Paginated customer documents list' })
  findAllDocuments(
    @Query() query: QueryCustomerDocumentDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findAllDocuments(user, query);
  }

  @Post()
  @ApiOperation({ summary: 'Upload/register a customer legal document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  createDocument(
    @Body() dto: CreateCustomerDocumentDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.createDocument(user, dto);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get document details by UUID' })
  @ApiParam({ name: 'uuid', description: 'Document UUID' })
  findDocumentByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.findDocumentByUuid(user, uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update document metadata or legal vetting status' })
  @ApiParam({ name: 'uuid', description: 'Document UUID' })
  updateDocument(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCustomerDocumentDto,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.updateDocument(user, uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Soft delete an archived document' })
  @ApiParam({ name: 'uuid', description: 'Document UUID' })
  removeDocument(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() user?: any,
  ) {
    return this.documentsService.removeDocument(user, uuid);
  }
}
