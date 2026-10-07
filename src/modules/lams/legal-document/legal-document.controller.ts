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

  @Get(':id')
  @ApiOperation({ summary: 'Get a legal document record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the legal document' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a legal document record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the legal document' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateLegalDocumentDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a legal document record by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the legal document' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
