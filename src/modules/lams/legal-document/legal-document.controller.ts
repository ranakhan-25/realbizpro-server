import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LegalDocumentService } from './legal-document.service';
import { CreateLegalDocumentDto } from './dto/create-legal-document.dto';
import { UpdateLegalDocumentDto } from './dto/update-legal-document.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@ApiTags('LAMS - Legal Documents')
@ApiBearerAuth()
@Controller('lams/legal-documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LegalDocumentController {
  constructor(private readonly service: LegalDocumentService) {}

  @Post()
  @Permissions('lams_legal_documents.create')
  @ApiOperation({ summary: 'Create a new legal document record' })
  async create(@Body() createDto: CreateLegalDocumentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('lams_legal_documents.read')
  @ApiOperation({ summary: 'Get all legal document records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @Permissions('lams_legal_documents.read')
  @ApiOperation({ summary: 'Get a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @Permissions('lams_legal_documents.update')
  @ApiOperation({ summary: 'Update a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateLegalDocumentDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @Permissions('lams_legal_documents.delete')
  @ApiOperation({ summary: 'Delete a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
