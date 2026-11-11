import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LegalVerificationService } from './legal-verification.service';
import { CreateLegalVerificationDto } from './dto/create-legal-verification.dto';
import { UpdateLegalVerificationDto } from './dto/update-legal-verification.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Legal Verification')
@ApiBearerAuth()
@Controller('lams/legal-verifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LegalVerificationController {
  constructor(private readonly service: LegalVerificationService) {}

  @Post()
  @Permissions('lams_legal_verification.create')
  @ApiOperation({ summary: 'Create a new legal verification record' })
  async create(@Body() createDto: CreateLegalVerificationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_legal_verification.read')
  @ApiOperation({ summary: 'Get all legal verification records' })
  async findAll(@Query('lead_id') leadId?: string, @Query('org_id') orgId?: string) {
    return this.service.findAll({ lead_id: leadId, org_id: orgId });
  }

  @Get(':uuid')
  @Permissions('lams_legal_verification.read')
  @ApiOperation({ summary: 'Get a legal verification record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal verification record' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_legal_verification.update')
  @ApiOperation({ summary: 'Update a legal verification record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal verification record' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateLegalVerificationDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_legal_verification.delete')
  @ApiOperation({ summary: 'Delete a legal verification record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal verification record' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
