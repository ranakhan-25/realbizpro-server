import { Controller, Post, Get, Body } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LAMS - Follow Ups')
@Controller('lams/follow-ups')
export class FollowUpController {
  constructor(private readonly service: FollowUpService) {}

  @Post()
  async create(@Body() createDto: CreateFollowUpDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
