import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
@ApiTags('HRM | Employee | Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly service: AttendanceService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new attendance',
  })
  create(@Body() dto: CreateAttendanceDto) {
    return this.service.create(dto);
  }
  @Get()
  @ApiOperation({
    summary:
      'Get all attendance records (paginated)',
  })
  findAll(@Query() query: QueryAttendanceDto) {
    return this.service.findAll(query);
  }
  @Get(':uuid')
  @ApiOperation({
    summary: 'Get attendance by UUID',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update attendance' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.service.update(uuid, dto);
  }
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Soft delete attendance',
  })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
  @Patch(':uuid/restore')
  @ApiOperation({
    summary: 'Restore deleted attendance',
  })
  restore(@Param('uuid') uuid: string) {
    return this.service.restore(uuid);
  }
}
