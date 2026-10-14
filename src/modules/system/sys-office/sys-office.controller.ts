import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SysOfficeService } from './sys-office.service';
import { CreateSysOfficeDto } from './dto/create-sys-office.dto';
import { UpdateSysOfficeDto } from './dto/update-sys-office.dto';
import { QuerySysOfficeDto } from './dto/query-sys-office.dto';

import { CurrentUserId } from '@/common/decorators/auth.decorators';
import { CurrentUser } from '@/common/decorators/auth.decorators';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { OfficeDropdownQueryDto } from './dto/query-office-type.dto';
import { StatusEnum } from '@/database/enum/status.enum';

@ApiTags('System | Office')
@ApiBearerAuth()
@Controller('sys-office')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SysOfficeController {
  constructor(
    private readonly service: SysOfficeService,
  ) {}

  // CREATE
  @Post()
  @Permissions('create_office')
  @ApiOperation({
    summary: 'Create a new office',
  })
  create(
    @Body() dto: CreateSysOfficeDto,
    @CurrentUserId() userId?: number,
  ) {
    return this.service.create(dto, userId);
  }

  // LIST
  @Get()
  @Permissions('list_office')
  @ApiOperation({ summary: 'Get office list' })
  findAll(
    @Query() query: QuerySysOfficeDto,
    @CurrentUser() user: any,
  ) {
    return this.service.findAndCount(query, user);
  }

  // DROPDOWN
  @Get('dropdown')
  @ApiOperation({
    summary:
      'Office dropdown (No permission required)',
  })
  dropdown(
    @Query() query: OfficeDropdownQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.service.dropdown(query, user);
  }

  // READ
  @Get(':uuid')
  @Permissions('read_office')
  @ApiOperation({ summary: 'Get office by UUID' })
  @ApiParam({ name: 'uuid' })
  findOne(
    @Param('uuid') uuid: string,
    @CurrentUser() user: any,
  ) {
    return this.service.findOne(uuid, user);
  }

  // UPDATE
  @Patch(':uuid')
  @Permissions('update_office')
  @ApiOperation({
    summary: 'Update office by UUID',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSysOfficeDto,
    @CurrentUserId() userId?: number,
    @CurrentUser() user?: any,
  ) {
    return this.service.update(
      uuid,
      dto,
      userId,
      user,
    );
  }

  // DELETE (SOFT)
  @Delete(':uuid')
  @Permissions('delete_office')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete office by UUID',
  })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId?: number,
    @CurrentUser() user?: any,
  ) {
    return this.service.remove(
      uuid,
      userId,
      user,
    );
  }
}
