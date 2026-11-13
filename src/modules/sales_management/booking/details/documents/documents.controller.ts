/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // âœ… Swagger Imports
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';

@ApiTags('Bookings - Documents') // âœ… API Tag
@Controller('bookings/:uuid/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new document for a booking' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  create(
    @Param('uuid') bookingUuid: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.create(bookingUuid, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for a booking (Paginated)' })
  findAll(
    @Param('uuid') bookingUuid: string,
    @Query() query: QueryDocumentDto,
  ) {
    return this.documentsService.findAllByBooking(bookingUuid, query);
  }

  @Get(':documentUuid')
  @ApiOperation({ summary: 'Get a specific document by UUID' })
  findOne(@Param('uuid') bookingUuid: string, @Param('documentUuid', ParseUUIDPipe) documentUuid: string) {
    return this.documentsService.findOne(documentUuid, bookingUuid);
  }

  @Patch(':documentUuid')
  @ApiOperation({ summary: 'Partially update a document' })
  async updateWithPatch(
    @Param('uuid') bookingUuid: string,
    @Param('documentUuid', ParseUUIDPipe) documentUuid: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    await this.documentsService.findOne(documentUuid, bookingUuid);
    return this.documentsService.update(documentUuid, dto);
  }

  @Put(':documentUuid')
  @ApiOperation({ summary: 'Fully update a document' })
  async updateWithPut(
    @Param('uuid') bookingUuid: string,
    @Param('documentUuid', ParseUUIDPipe) documentUuid: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    await this.documentsService.findOne(documentUuid, bookingUuid);
    return this.documentsService.update(documentUuid, dto);
  }

  @Delete(':documentUuid')
  @ApiOperation({ summary: 'Soft delete a document' })
  async remove(@Param('uuid') bookingUuid: string, @Param('documentUuid', ParseUUIDPipe) documentUuid: string) {
    await this.documentsService.findOne(documentUuid, bookingUuid);
    return this.documentsService.remove(documentUuid);
  }
}
