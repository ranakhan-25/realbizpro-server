import { Controller, Post, Get, Body } from '@nestjs/common';
import { AcquisitionLeadService } from './acquisition-lead.service';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LAMS - Acquisition Leads')
@Controller('lams/acquisition-leads')
export class AcquisitionLeadController {
  constructor(private readonly service: AcquisitionLeadService) {}

  @Post()
  async create(@Body() createDto: CreateAcquisitionLeadDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
