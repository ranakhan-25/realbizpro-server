import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

@Controller('realbizpro/api/v1/quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.quotationService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.quotationService.findOne(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationService.update(uuid, updateQuotationDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.quotationService.remove(uuid);
  }

  @Post(':uuid/restore')
  restore(@Param('uuid') uuid: string) {
    return this.quotationService.restore(uuid);
  }
}