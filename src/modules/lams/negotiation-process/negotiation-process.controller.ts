import { Controller, Post, Get, Body } from '@nestjs/common';
import { NegotiationProcessService } from './negotiation-process.service';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LAMS - Negotiation Process')
@Controller('lams/negotiation-processes')
export class NegotiationProcessController {
  constructor(private readonly service: NegotiationProcessService) {}

  @Post()
  async create(@Body() createDto: CreateNegotiationProcessDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
