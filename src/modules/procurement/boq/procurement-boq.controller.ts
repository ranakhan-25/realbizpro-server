import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import { ProcurementBoqService } from './procurement-boq.service';
import { CreateProcurementBoqDto, ImportProcurementBoqDto, QueryProcurementBoqDto } from './dto/procurement-boq.dto';

@ApiTags('Procurement | BOQ')
@ApiBearerAuth()
@Controller('procurement/boq')
export class ProcurementBoqController {
  constructor(private readonly service: ProcurementBoqService) {}
  @Get('dropdowns') @ApiOperation({ summary: 'Dropdown data for procurement BOQ' }) dropdowns() { return this.service.dropdowns(); }
  @Get('import-template') @ApiOperation({ summary: 'Download Excel template for BOQ import' }) template(@Res() response: Response) {
    const sheet = XLSX.utils.aoa_to_sheet([['Item Code', 'Item', 'Unit', 'Quantity', 'Rate', 'Cost Type', 'Remarks'], ['', '', '', '', '', 'material', '']]);
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, 'BOQ Items');
    const buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' });
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename="procurement-boq-template.xlsx"');
    response.end(buffer);
  }
  @Get() @ApiOperation({ summary: 'List and filter project-wise procurement BOQs' }) list(@Query() query: QueryProcurementBoqDto) { return this.service.list(query); }
  @Get(':uuid') @ApiOperation({ summary: 'View BOQ header, items, notes and calculated cost summary' }) view(@Param('uuid', ParseUUIDPipe) uuid: string) { return this.service.view(uuid); }
  @Post() @ApiOperation({ summary: 'Create procurement BOQ with item lines and important notes' }) create(@Body() dto: CreateProcurementBoqDto, @Req() req: any) { return this.service.create(dto, req.user?.id); }
  @Patch(':uuid') @ApiOperation({ summary: 'Update procurement BOQ and replace its item lines/notes' }) update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: CreateProcurementBoqDto, @Req() req: any) { return this.service.update(uuid, dto, req.user?.id); }
  @Delete(':uuid') @ApiOperation({ summary: 'Soft-delete procurement BOQ and its child records' }) remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: any) { return this.service.remove(uuid, req.user?.id); }
  @Post('import') @UseInterceptors(FileInterceptor('file')) @ApiConsumes('multipart/form-data') @ApiOperation({ summary: 'Import BOQ item rows from Excel and create a BOQ' })
  @ApiBody({ schema: { type: 'object', required: ['file', 'project_id', 'title', 'date', 'due_date', 'boq_type'], properties: { file: { type: 'string', format: 'binary' }, project_id: { type: 'string' }, company_id: { type: 'string' }, title: { type: 'string' }, date: { type: 'string', format: 'date' }, due_date: { type: 'string', format: 'date' }, boq_type: { type: 'string' }, margin_overhead: { type: 'number' } } } })
  async importExcel(@UploadedFile() file: Express.Multer.File, @Body() dto: ImportProcurementBoqDto, @Req() req: any) {
    if (!file?.buffer) throw new BadRequestException('Excel file is required');
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); const first = workbook.Sheets[workbook.SheetNames[0]];
    if (!first) throw new BadRequestException('The uploaded Excel file has no worksheet');
    const imported = XLSX.utils.sheet_to_json<Record<string, any>>(first, { defval: '' });
    return this.service.importRows(dto, imported, req.user?.id);
  }
}
