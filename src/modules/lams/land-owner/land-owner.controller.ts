import { Controller, Post, Get, Body } from '@nestjs/common';
import { LandOwnerService } from './land-owner.service';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LAMS - Land Owners')
@Controller('lams/land-owners')
export class LandOwnerController {
  constructor(private readonly service: LandOwnerService) {}

  @Post()
  async create(@Body() createDto: CreateLandOwnerDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
