import { Controller, Post, Get, Body } from '@nestjs/common';
import { LegalDocumentService } from './legal-document.service';
import { CreateLegalDocumentDto } from './dto/create-legal-document.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LAMS - Legal Documents')
@Controller('lams/legal-documents')
export class LegalDocumentController {
  constructor(private readonly service: LegalDocumentService) {}

  @Post()
  async create(@Body() createDto: CreateLegalDocumentDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
