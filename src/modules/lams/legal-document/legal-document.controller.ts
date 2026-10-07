import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { LegalDocumentService } from './legal-document.service';
import { CreateLegalDocumentDto } from './dto/create-legal-document.dto';
import { UpdateLegalDocumentDto } from './dto/update-legal-document.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('LAMS - Legal Documents')
@Controller('lams/legal-documents')
export class LegalDocumentController {
  constructor(private readonly service: LegalDocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new legal document record' })
  async create(@Body() createDto: CreateLegalDocumentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all legal document records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async update(@Param('uuid') uuid: string, @Body() updateDto: UpdateLegalDocumentDto) {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a legal document record by UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID of the legal document' })
  async remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
