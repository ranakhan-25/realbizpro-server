import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUserId } from '@/common/decorators/auth.decorators';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { QuerySysOfficeTypeDto } from './dto/query-sys-office-type.dto';
import { DropdownSysOfficeTypeDto } from './dto/query-sys-office-type-dropdown.dto';
import { SysOfficeTypeService } from './hrm_office_type.service';
import { CreateSysOfficeTypeDto } from './dto/create-hrm_office_type.dto';
import { UpdateSysOfficeTypeDto } from './dto/update-hrm_office_type.dto';

@ApiTags('System | Office Type')
@ApiBearerAuth()
@Controller('sys-office-type')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SysOfficeTypeController {
  constructor(
    private readonly service: SysOfficeTypeService,
  ) {}

  @Post()
  @Permissions('create_office_type')
  @ApiOperation({
    summary: 'Create office type',
  })
  create(
    @Body() dto: CreateSysOfficeTypeDto,
    @CurrentUserId() userId?: number,
  ) {
    return this.service.create(dto, userId);
  }

  @Get()
  @Permissions('list_office_type')
  @ApiOperation({
    summary: 'List office types',
  })
  findAll(
    @Query() query: QuerySysOfficeTypeDto,
    @Req() req: Request,
  ) {
    return this.service.findAndCount(
      query,
      (req as any).user,
    );
  }

  // NO PERMISSION
  @Get('dropdown')
  @ApiOperation({
    summary: 'Office type dropdown',
  })
  dropdown(
    @Query() query: DropdownSysOfficeTypeDto,
    @Req() req: Request,
  ) {
    return this.service.dropdown(
      query.status,
      (req as any).user,
    );
  }

  @Get(':uuid')
  @Permissions('read_office_type')
  @ApiOperation({
    summary: 'Get single office type',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @Permissions('update_office_type')
  @ApiOperation({
    summary: 'Update office type',
  })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSysOfficeTypeDto,
    @CurrentUserId() userId?: number,
  ) {
    return this.service.update(uuid, dto, userId);
  }

  @Delete(':uuid')
  @Permissions('delete_office_type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete office type',
  })
  remove(
    @Param('uuid') uuid: string,
    @CurrentUserId() userId?: number,
  ) {
    return this.service.remove(uuid, userId);
  }
}
