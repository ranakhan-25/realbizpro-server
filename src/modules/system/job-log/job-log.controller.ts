import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { JobLogService } from './job-log.service';

@Controller('job-log')
export class JobLogController {
  constructor(
    private readonly jobLogService: JobLogService,
  ) {}

  @Get()
  findAll() {
    return this.jobLogService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.jobLogService.findOne(code);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.jobLogService.remove(code);
  }
}
