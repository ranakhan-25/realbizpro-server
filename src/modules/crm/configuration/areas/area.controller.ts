import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAreaDto } from './dto/create-area.dto';
import { QueryAreaDto } from './dto/query-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaService } from './area.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserId } from 'src/common/decorators/auth.decorators';

@ApiTags('CRM | Configuration | Area')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('crm/configuration/areas')
export class AreaController {
  constructor(
    private readonly service: AreaService,
  ) {}

  @Post()
  @Permissions('create_crm_area')
  @ApiOperation({ summary: 'Create a CRM area' })
  create(
    @Body() dto: CreateAreaDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.create(dto, userId, currentUser);
  }

  @Get()
  @Permissions('list_crm_area')
  @ApiOperation({
    summary:
      'List CRM areas with search, status and pagination filters',
  })
  findAll(
    @Query() query: QueryAreaDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findAll(query, currentUser);
  }

  @Get('dropdown')
  @Permissions('read_crm_area')
  @ApiOperation({
    summary:
      'Get active CRM areas for form dropdowns',
  })
  dropdown(@CurrentUser() currentUser: any) {
    return this.service.dropdown(currentUser);
  }

  @Get('dropdown/statuses')
  @Permissions('read_crm_area')
  @ApiOperation({
    summary:
      'Get area statuses for the form dropdown',
  })
  statusDropdown() {
    return this.service.statusDropdown();
  }

  @Get(':uuid')
  @Permissions('read_crm_area')
  @ApiOperation({
    summary:
      'Get CRM area details by UUID, including related leads',
  })
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.findOne(uuid, currentUser);
  }

  @Patch(':uuid')
  @Permissions('update_crm_area')
  @ApiOperation({
    summary: 'Update a CRM area by UUID',
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateAreaDto,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.update(uuid, dto, userId, currentUser);
  }

  @Delete(':uuid')
  @Permissions('delete_crm_area')
  @ApiOperation({
    summary: 'Soft delete a CRM area by UUID',
  })
  remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.remove(uuid, userId, currentUser);
  }

  @Patch(':uuid/restore')
  @Permissions('update_crm_area')
  @ApiOperation({
    summary:
      'Restore a soft-deleted CRM area by UUID',
  })
  restore(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @CurrentUserId() userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.service.restore(uuid, userId, currentUser);
  }
}
